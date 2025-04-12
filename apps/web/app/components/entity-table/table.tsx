import { flexRender, type ColumnDef, type Row } from "@tanstack/react-table";
import React, { useMemo, type KeyboardEvent } from "react";

import { useHotkeys } from "react-hotkeys-hook";
import { DataTablePagination } from "~/components/table/data-table-pagination";
import { useDataTable } from "~/components/table/use-data-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { filterableColumns, getEntityColumns } from "./columns";
import { useMatches } from "react-router";
import type { Entity } from "@work-profile/db";
import { DataTableToolbar } from "../table/data-table-toolbar";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
interface EntityTableProps {
	entities: Entity[];
	deleteEntity: (keys: string[]) => void;
	setEntityID: (value: string) => void;
}

function EntityTable({
	entities,
	deleteEntity,

	setEntityID,
}: Readonly<EntityTableProps>) {
	const matches = useMatches();
	console.log("matches", matches[matches.length - 1].pathname);
	const columns = useMemo<ColumnDef<Entity>[]>(
		() => getEntityColumns({ deleteEntity }),
		[deleteEntity],
	);
	useHotkeys(["D"], () => {
		const rows = table.getFilteredSelectedRowModel().rows;
		deleteEntity(rows.map((r) => r.original.id));
		table.toggleAllPageRowsSelected(false);
	});
	const table = useDataTable({
		columns,
		data: entities,
	});
	const { rows } = table.getRowModel();

	const parentRef = React.useRef<HTMLDivElement>(null);

	const handleKeyDown = (
		e: KeyboardEvent<HTMLTableRowElement>,
		row: Row<Entity>,
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
			setEntityID(row.original.id);
		}
		if (e.key === " ") {
			e.preventDefault();
			e.stopPropagation();
			row.toggleSelected(!row.getIsSelected());
		}
	};

	return (
		<div>
			<DataTableToolbar
				className="pb-4"
				table={table}
				filterableColumns={filterableColumns}
				toolbarButton={
					<Button type="button">
						<PlusIcon className="size-4" aria-hidden="true" />
						Add
					</Button>
				}
			/>
			<div className="w-full border rounded-xl overflow-hidden">
				<Table>
					<TableHeader className="bg-muted sticky top-0 z-10">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											className="text-sm"
											key={header.id}
											colSpan={header.colSpan}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{rows.length > 0 ? (
							rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									tabIndex={0}
									className={cn(row.getIsSelected() && "bg-gray-50")}
									onClick={() => setEntityID(row.original.id)}
									onKeyDown={(e) => handleKeyDown(e, row)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-80 text-center"
								>
									No data available
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} className="p-4" />
		</div>
	);
}

export { EntityTable };
