import {
	index,
	integer,
	json,
	pgTable,
	text,
	varchar,
} from "drizzle-orm/pg-core";

export const statuses = ["In progress", "Done", "Cancelled"] as const;

export const entity = pgTable(
	"entity",
	{
		id: varchar("id").notNull().primaryKey(),
		images: json("images").$type<string[]>(),
		title: varchar("title"),
		number: integer("number"),
		status: text("status", { enum: statuses }),
		version: integer("version").notNull(),
		createdAt: varchar("created_at").notNull(),
	},
	(entity) => ({
		titleIndex: index("title_index").on(entity.title),
	}),
);
