import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import type { DataTableFilterableColumn } from "~/types/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RowActions } from "./row-actions";
import { schema, type Entity } from "@work-profile/db";
import { Checkbox } from "../ui/checkbox";
import { useIsMobile } from "~/hooks/use-mobile";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function getEntityColumns({
	deleteEntity,
}: {
	deleteEntity: (keys: string[]) => void;
}): ColumnDef<Entity, unknown>[] {
	return [
		{
			id: "select",
			header: ({ table }) => (
				<div className="flex items-center justify-center">
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label="Select all"
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className="flex items-center justify-center">
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "thumbnail",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Thumbnail" />
			),
			cell: ({ row }) => {
				return (
					<div className="flex justify-center w-[65px] items-center">
						<Avatar className="size-[60px] ">
							<AvatarImage
								src={row.original.images ? row.original.images[0] : undefined}
								alt="product image"
							/>
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</div>
				);
			},

			enableSorting: false,
			enableHiding: true,
		},
		{
			accessorKey: "title",
			header: "Title",
			cell: ({ row }) => {
				return <TableCellViewer item={row.original} />;
			},
			enableHiding: false,
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				return <Badge>{row.original.number}</Badge>;
			},
		},
		{
			accessorKey: "number",
			header: "Number",
			cell: ({ row }) => {
				return <p>{row.original.number}</p>;
			},
			enableHiding: false,
		},
		{
			id: "actions",
			cell: ({ row }) => <RowActions row={row} deleteEntity={deleteEntity} />,
		},
	];
}
export const filterableColumns: DataTableFilterableColumn<Entity>[] = [
	{
		id: "status",
		title: "Status",
		options: schema.statuses.map((s) => ({
			label: s,
			value: s,
		})),
	},
];

function TableCellViewer({ item }: { item: Entity }) {
	const isMobile = useIsMobile();

	return (
		<Drawer direction={isMobile ? "bottom" : "right"}>
			<DrawerTrigger asChild>
				<Button variant="link" className="text-foreground w-fit px-0 text-left">
					{item.title}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="gap-1">
					<DrawerTitle>{item.title}</DrawerTitle>
					<DrawerDescription>
						Showing total visitors for the last 6 months
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<Button>Submit</Button>
					<DrawerClose asChild>
						<Button variant="outline">Done</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
