"use server";

import { equipmentSchema } from "@/components/schama/equipment";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EquipmentTable } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
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

