import type { Table } from "@tanstack/react-table";

import type { DebouncedFunc } from "~/types/debounce";
import type { DataTableSearchableColumn, Option } from "~/types/table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { cn } from "~/lib/utils";
import { Input } from "../ui/input";

export interface DataTableFilterableColumn<TData>
	extends DataTableSearchableColumn<TData> {
	options: Option[];
}

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	filterableColumns?: DataTableFilterableColumn<TData>[] | undefined;
	toolbarButton?: React.ReactNode;
	viewOptions?: boolean;
	onSearch?: DebouncedFunc<(value: string) => void>;
	className?: string;
}

export function DataTableToolbar<TData>({
	filterableColumns,
	table,
	toolbarButton,
	viewOptions = true,
	onSearch,
	className,
}: Readonly<DataTableToolbarProps<TData>>) {
	return (
		<div className={cn("flex items-center justify-between", className)}>
			<div className="flex gap-2 pr-2">
				<Input
					placeholder="Search"
					type="search"
					className="lg:min-w-[300px]"
					onChange={(e) => onSearch?.(e.target.value)}
				/>
				<div className="flex-wrap flex">
					{filterableColumns?.map(
						(column) =>
							table.getColumn(String(column.id)) && (
								<DataTableFacetedFilter
									key={String(column.id)}
									column={table.getColumn(String(column.id))}
									title={column.title}
									options={column.options}
									table={table}
								/>
							),
					)}
				</div>
			</div>
			<div className="flex gap-2">
				<div className="w-fit">{toolbarButton}</div>
				{/* {viewOptions && <DataTableViewOptions table={table} />} */}
			</div>
		</div>
	);
}
