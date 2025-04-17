import { enumeration, json, number, string, table } from "@rocicorp/zero";
import type { schema } from "@work-profile/db";

export const entity = table("entity")
	.columns({
		id: string(),
		title: string().optional(),
		money: number(),
		status: enumeration<(typeof schema.entityStatuses)[number]>(),
		images: json<string[]>().optional(),
		created_at: string(),
	})
	.primaryKey("id");
