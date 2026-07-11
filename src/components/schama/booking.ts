import z from "zod";

export const bookingSchema = z.object({
    equipmentId: z.string().uuid("Invalid equipment id"),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    purpose: z.string().optional(),
}).refine((data) => data.endTime > data.startTime, {
    message:"End time must be greater than start time",
    path:["endTime"]
}
)
