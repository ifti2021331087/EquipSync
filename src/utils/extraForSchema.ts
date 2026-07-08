import { pgEnum } from "drizzle-orm/pg-core";

export const equipmentConditionEnum = pgEnum("equipment_condition", ["excellent", "good", "fair", "poor"]);
export const equipmentStatusEnum = pgEnum("equipment_status", ["active", "maintenance", "retired"]);