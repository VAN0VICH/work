import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
	IconCircleCheckFilled,
	IconDotsVertical,
	IconLayoutCollage,
	IconLayoutColumns,
	IconLoader,
	IconPlus,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type Row,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { Entity } from "~/zero/schema";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useZero } from "~/zero/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { useGlobalState } from "~/zustand/state";

interface EntityTableProps {
	deleteEntity: (keys: string[]) => void;
	setEntityID: (value: string) => void;
}

const columns: ColumnDef<Entity>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex items-center justify-center">
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
		header: "Thumbnail",
		cell: ({ row }) => {
			return (
				<div className="flex justify-center w-[65px] items-center">
					<Avatar className="size-[50px] rounded-lg">
						<AvatarImage
							src={row.original.images ? row.original.images[0] : undefined}
							alt="product image"
						/>
						<AvatarFallback className="rounded-lg">
							<IconLayoutCollage />
						</AvatarFallback>
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
			return <p>{row.original.title}</p>;
		},
		enableHiding: false,
	},

	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant="outline" className="text-muted-foreground px-1.5">
				{row.original.status === "Done" ? (
					<IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
				) : (
					<IconLoader />
				)}
				{row.original.status}
			</Badge>
		),
	},
	{
		accessorKey: "money",
		header: "Money",
		cell: ({ row }) => <p>{row.original.money / 100}</p>,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const z = useZero();
			function deleteRow(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
				e.preventDefault();
				e.stopPropagation();
				toast.promise(z.mutate.entity.delete({ id: row.original.id }), {
					success: () => {
						return "Entity deleted.";
					},
					error: () => {
						return "Error deleting entity.";
					},
				});
			}
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
							size="icon"
						>
							<IconDotsVertical />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-32">
						<DropdownMenuItem variant="destructive" onClick={deleteRow}>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

function RowComponent({
	row,
	setEntityID,
}: { row: Row<Entity>; setEntityID: (value: string) => void }) {
	return (
		<TableRow
			data-state={row.getIsSelected() && "selected"}
			className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
			onClick={() => setEntityID(row.original.id)}
		>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

export function EntityTable({ deleteEntity, setEntityID }: EntityTableProps) {
	const setEntityPreview = useGlobalState((s) => s.setEntityPreview);
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const z = useZero();
	const [data, dataResult] = useQuery(z.query.entity);
	console.log("dataResult", dataResult);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<div className="p-4 flex flex-col gap-4">
			<div className="flex items-center justify-between gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<IconLayoutColumns />
							<span className="hidden lg:inline">Customize Columns</span>
							<span className="lg:hidden">Columns</span>
							<IconChevronDown />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						{table
							.getAllColumns()
							.filter(
								(column) =>
									typeof column.accessorFn !== "undefined" &&
									column.getCanHide(),
							)
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
				<Button size="sm" onClick={() => setEntityPreview(true)}>
					<IconPlus />
					<span className="hidden sm:inline">Add Entity</span>
				</Button>
			</div>
			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader className="bg-muted dark:bg-neutral-900 sticky top-0 z-10">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
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
					<TableBody className="**:data-[slot=table-cell]:first:w-8">
						{table.getRowModel().rows?.length ? (
							table
								.getRowModel()
								.rows.map((row) => (
									<RowComponent
										key={row.id}
										row={row}
										setEntityID={setEntityID}
									/>
								))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between px-4">
				<div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex w-full items-center gap-8 lg:w-fit">
					<div className="hidden items-center gap-2 lg:flex">
						<Label htmlFor="rows-per-page" className="text-sm font-medium">
							Rows per page
						</Label>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger size="sm" className="w-20" id="rows-per-page">
								<SelectValue
									placeholder={table.getState().pagination.pageSize}
								/>
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-fit items-center justify-center text-sm font-medium">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>
					<div className="ml-auto flex items-center gap-2 lg:ml-0">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<IconChevronsLeft />
						</Button>
						<Button
							variant="outline"
							className="size-8"
							size="icon"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<IconChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="size-8"
							size="icon"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<IconChevronRight />
						</Button>
						<Button
							variant="outline"
							className="hidden size-8 lg:flex"
							size="icon"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<IconChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
