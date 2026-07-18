"use server";

import { equipmentSchema } from "@/components/schama/equipment";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookingTable, EquipmentTable, user } from "@/lib/db/schema";
import { and, asc, count, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";


export async function uploadEquipmentAction(data: z.infer<typeof equipmentSchema>) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || session.user.role !== 'admin') {
        throw new Error("You must be admin to create equipment");
    }

    try {
        // 2. Parse the incoming object directly
        const validateFields = equipmentSchema.parse(data);

        await db.insert(EquipmentTable).values({
            name: validateFields.title,
            category: validateFields.category,
            internalTag: validateFields.internalTag,
            description: validateFields.description,
            imageUrl: validateFields.imageUrl,
            equipmentCondition: validateFields.equipmentCondition,
            equipmentStatus: validateFields.equipmentStatus,
            requireApproval: validateFields.requireApproval,
            maxCheckOutDays: validateFields.maxCheckOutDays
        });

        revalidatePath("/admin/equipment");

        return { success: true }
    }
    catch (e) {
        console.log("Error while creating equipment: ", e);
        return {
            success: false,
            error: "Failed to upload equipment"
        }
    }
}

export async function getAllEquipmentAction(category?: string) {

    try {
        const query = await db.select().from(EquipmentTable)
            .where(category ? eq(EquipmentTable.category, category) : undefined);

        return query;
    }
    catch (e) {
        console.log("Error fetching equipment:", e);
        return []
    }
}

export async function getTotalEquipmentCountAction() {

    try {
        const [result] = await db.select({ totalEquipment: count() })
            .from(EquipmentTable)

        return result?.totalEquipment;
    }
    catch (e) {
        console.log(e);
        return 0;
    }
}

export const updateEquipmentStockAction = async (equipmentId: string, newStock: number) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== 'admin') {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db.update(EquipmentTable)
            .set({ stock: newStock })
            .where(eq(EquipmentTable.id, equipmentId));

        // Revalidate the specific equipment page so the new data renders on refresh
        revalidatePath(`/admin/equipment/${equipmentId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating stock: ", error);
        return { success: false, error: "Failed to update stock" };
    }
}

export async function reviewBookingAction(bookingId: string, newStatus: "approved" | "denied") {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || session.user.role !== 'admin') {
        throw new Error("You must be admin to review the booking.");
    }

    try {
        await db.update(BookingTable).set({
            status: newStatus,
            reviewedById: session.user.id,
            reviewedAt: new Date(),
            updatedAt: new Date()
        })

        revalidatePath("/admin/approval");
        revalidatePath("/admin/schedule");

        return {
            success: true
        }
    }
    catch (e) {
        console.log("Booking review error: ", e);
        return {
            success: false,
            error: "An unexpected error occurred while reviewing the booking."
        }
    }
}

export const pendingBookingAction = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || session.user.role !== 'admin') {
        throw new Error("You must be admin to get the pending bookings");
    }

    try {
        const result = await db.select(
            {
                id: BookingTable.id,
                userName: user.name,
                equipmentName: EquipmentTable.name,
                equipmentCategory: EquipmentTable.category,
                equipmentTag: EquipmentTable.internalTag,
                startTime: BookingTable.startTime,
                endTime: BookingTable.endTime,
                status: BookingTable.status
            }
        ).from(BookingTable)
            .leftJoin(EquipmentTable, () => eq(BookingTable.equipmentId, EquipmentTable.id))
            .leftJoin(user, () => eq(BookingTable.userId, user.id))
            .where(eq(BookingTable.status, 'pending'))
        return result;
    }
    catch (e) {
        console.log("Get pending bookings error: ", e)
        return [];
    }
}

export const togglePendingStatus = async (bookingId: string, newStatus: "active" | "pending" | "approved" | "returned" | "denied" | "cancelled" | "late") => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || session.user.role !== 'admin') {
        throw new Error("You must be admin to toggle the pending request.");
    }

    try {
        await db.update(BookingTable).set(
            {
                status: newStatus
            }
        ).where(eq(BookingTable.id, bookingId))

        revalidatePath("/admin/approval")
        revalidatePath("/admin/schedule")
        return {
            success: true
        }
    }
    catch (e) {
        console.log(e);
        return {
            success: false
        }
    }
}

export const getWeeklyEquipmentStatsAction = async (equipmentId: string, weekStartDateStr: string) => {

    const startDate = new Date(weekStartDateStr);
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    try {
        const weeklyBookings = await db.select(
            {
                userName: user.name,
                startTime: BookingTable.startTime,
                endTime: BookingTable.endTime,
                status: BookingTable.status
            })
            .from(BookingTable)
            .leftJoin(user, () => eq(BookingTable.userId, user.id))
            .where(
                and(
                    eq(BookingTable.equipmentId, equipmentId),
                    gte(BookingTable.startTime, startDate),
                    lte(BookingTable.endTime, endDate),
                    inArray(BookingTable.status, ['pending', 'approved'])
                )
            )

        const stats = Array.from({ length: 7 }, () => ({
            pending: [] as { userName: string, slot: string }[],
            approved: [] as { userName: string, slot: string }[],
        }))
        weeklyBookings.map((booking) => {
            const bookingDate = new Date(booking.startTime);
            bookingDate.setHours(0, 0, 0, 0);
            const diffTime = bookingDate.getTime() - startDate.getTime();
            const index = Math.floor(diffTime / (24 * 60 * 60 * 1000));

            if (index >= 0 && index < 7) {
                const userName = booking.userName || "unknown user";
                const startHour = booking.startTime.getHours().toString().padStart(2, '0');
                const endHour = booking.endTime.getHours().toString().padStart(2, '0');

                const bookingDetails = {
                    userName: booking.userName || "unknown user",
                    slot: `${startHour}:00-${endHour}:00`
                }
                if (booking.status === 'approved') {
                    stats[index].approved.push(bookingDetails)
                }
                if (booking.status === 'pending') {
                    stats[index].pending.push(bookingDetails)
                }
            }
        })
        return stats;
    }
    catch (error) {
        console.error("Error fetching daily slots:", error);
        return Array.from({ length: 7 }, () => ({
            pending: [],
            approved: [],
        }))
    }
}


// checkout-related-actions

export const getReadyForPickupAction = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || session.user.role !== 'admin') {
        return [];
    }

    // CREATE NEW TIME WINDOWS
    const now = new Date();
    const twentyMinsFromNow = new Date(now.getTime() + 20 * 60 * 1000);

    try {
        const data = await db.select({
            id: BookingTable.id,
            equipmentName: EquipmentTable.name,
            currentStock: EquipmentTable.stock,
            userName: user.name,
            startTime: BookingTable.startTime,
            endTime: BookingTable.endTime,
        })
            .from(BookingTable)
            .leftJoin(user, eq(user.id, BookingTable.userId))
            .leftJoin(EquipmentTable, eq(EquipmentTable.id, BookingTable.equipmentId))
            .where(
                and(
                    eq(BookingTable.status, 'approved'),
                    // Show if it starts in the next 20 mins OR has already started
                    lte(BookingTable.startTime, twentyMinsFromNow),
                    // Hide it if the booking's end time has already completely passed
                    gte(BookingTable.endTime, now)
                )
            ).orderBy(asc(BookingTable.startTime))

        return data;

    }
    catch (e) {
        console.log("Error fetching ready pickups: ", e);
        return [];
    }
}

export const getAwaitingReturnAction = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || session.user.role !== 'admin') {
        return [];
    }

    try {
        const data = await db.select(
            {
                id: BookingTable.id,
                equipmentName: EquipmentTable.name,
                userName: user.name,
                startTime: BookingTable.startTime,
                endTime: BookingTable.endTime,
            }
        )
            .from(BookingTable)
            .leftJoin(user, eq(user.id, BookingTable.userId))
            .leftJoin(EquipmentTable, eq(EquipmentTable.id, BookingTable.equipmentId))
            .where(eq(BookingTable.status, 'active'))
            .orderBy(asc(BookingTable.endTime))

        return data;
    }
    catch (e) {
        console.error("FULL DATABASE ERROR:", JSON.stringify(e, Object.getOwnPropertyNames(e)));
        return [];
    }
}

export const grantEquipmentAction = async (bookingId: string) => {
    try {
        const [booking] = await db.select({
            equipmentId: BookingTable.equipmentId
        })
            .from(BookingTable)
            .where(eq(BookingTable.id, bookingId))

        if (!booking || !booking.equipmentId) {
            return {
                success: false,
                error: "Booking or equipment not found!"
            }
        }

        await db.update(BookingTable).set({
            status: 'active'
        }).where(eq(BookingTable.id, bookingId));

        await db.update(EquipmentTable).set({
            stock: sql`${EquipmentTable.stock} - 1`
        }).where(eq(EquipmentTable.id, booking.equipmentId));

        revalidatePath('/admin');
        revalidatePath('/admin/handoff');

        return {
            success: true
        }
    }
    catch (e) {
        console.error("🔥 FATAL CHECKOUT ERROR: ", e);
        return { success: false, error: "Failed to checkout" };
    }
}
export const returnEquipmentAction = async (bookingId: string) => {
    try {
        const [booking] = await db.select({
            equipmentId: BookingTable.equipmentId,
            startTime: BookingTable.startTime,
            endTime:BookingTable.endTime,
        })
            .from(BookingTable)
            .where(eq(BookingTable.id, bookingId));

        if (!booking || !booking.equipmentId) {
            return { success: false, error: "Booking or equipment not found" };
        }
        const currentTime = new Date();
        const isLate = currentTime > booking.endTime;
        await db.update(BookingTable)
            .set({ status: isLate ? 'late' : 'returned' })
            .where(eq(BookingTable.id, bookingId));

        await db.update(EquipmentTable)
            .set({ stock: sql`${EquipmentTable.stock} + 1` })
            .where(eq(EquipmentTable.id, booking.equipmentId));

        revalidatePath('/admin');
        revalidatePath('/admin/handoff');
        return { success: true };
    } catch (e) {
        console.error("Return Error: ", e);
        return { success: false, error: "Failed to return" };
    }
}
