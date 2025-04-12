import type { InferSelectModel } from "drizzle-orm";
import type { entity } from "../schema";

export type Entity = InferSelectModel<typeof entity>;
