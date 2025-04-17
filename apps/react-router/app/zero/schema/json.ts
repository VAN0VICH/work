import { json, string, table } from "@rocicorp/zero";

export const jsonTable = table("json")
	.columns({
		id: string(),
		value: json(),
	})
	.primaryKey("id");
