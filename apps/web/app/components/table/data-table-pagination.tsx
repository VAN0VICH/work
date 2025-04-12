import type { Table } from "@tanstack/react-table";
import { cn } from "~/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Button } from "../ui/button";
import {
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	className?: string;
	pageSizes?: number[];
}

export function DataTablePagination<TData>({
	table,
	className,
	pageSizes = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) {
	return (
		<div className={cn("flex items-center justify-center", className)}>
			<div className="hidden md:block text-sm text-muted-foreground">
				<p>
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</p>
			</div>
			<div className="flex gap-4 items-center justify-center w-full">
				<div className="flex items-center gap-2">
					<p className="hidden sm:block text-sm text-nowrap">Rows per page</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px] text-accent-11">
							{table.getState().pagination.pageSize}
						</SelectTrigger>
						<SelectContent side="top" className="backdrop-blur-sm">
							{pageSizes.map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex justify-between w-full">
					<div className="items-center flex justify-center w-full">
						<p>
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount() === 0 ? 1 : table.getPageCount()}
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							type="button"
							className="hidden lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<DoubleArrowLeftIcon className="text-accent-11" />
						</Button>
						<Button
							type="button"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<ArrowLeft size={16} className="text-accent-11" />
						</Button>
						<Button
							type="button"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<ArrowRight size={16} className="text-accent-11" />
						</Button>
						<Button
							type="button"
							className="hidden lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<DoubleArrowRightIcon className="text-accent-11" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
