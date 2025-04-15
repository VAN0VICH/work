import {
	index,
	integer,
	json,
	pgTable,
	text,
	varchar,
} from "drizzle-orm/pg-core";

export const entityStatuses = ["In progress", "Done", "Cancelled"] as const;

export const entity = pgTable(
	"entity",
	{
		id: varchar("id").notNull().primaryKey(),
		images: json("images").$type<string[]>(),
		title: varchar("title"),
		money: integer("money"),
		status: text("status", { enum: entityStatuses }),
		createdAt: varchar("created_at").notNull(),
	},
	(entity) => ({
		titleIndex: index("title_index").on(entity.title),
	}),
);
