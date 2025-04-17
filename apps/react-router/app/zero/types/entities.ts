import type { Row } from "@rocicorp/zero";
import type { schema } from "../schema";

export type Entity = Row<typeof schema.tables.entity>;
