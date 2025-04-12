import { CheckIcon } from "@radix-ui/react-icons";
import type { Column, Table } from "@tanstack/react-table";
import type * as React from "react";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { XIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface DataTableFacetedFilterProps<TData, TValue> {
	column: Column<TData, TValue> | undefined;
	title?: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
	table: Table<TData>;
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
	table,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<Popover>
			<PopoverTrigger>
				<Button variant={"outline"}>
					<div>
						<p
							className={cn(
								"font-body font-normal text-sm h-9 flex items-center",
								{
									hidden: selectedValues.size > 0,
								},
							)}
						>
							{title}
						</p>
						{selectedValues?.size > 0 && (
							<div className="h-9 flex flex-col justify-center px-1">
								<div className="hidden space-x-1 lg:flex">
									{selectedValues.size > 2 ? (
										<Badge>{selectedValues.size} selected</Badge>
									) : (
										options
											.filter((option) => selectedValues.has(option.value))
											.map((option) => (
												<Badge key={option.value}>{option.label}</Badge>
											))
									)}
								</div>
							</div>
						)}
					</div>
					{isFiltered && (
						<Button
							variant="ghost"
							className="h-2"
							onClick={(e) => {
								e.stopPropagation();
								table.resetColumnFilters();
							}}
						>
							<XIcon className="min-w-4 max-w-4 min-h-4 max-h-4" />
						</Button>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value);
								return (
									<CommandItem
										key={option.value}
										className="group"
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(option.value);
											} else {
												selectedValues.add(option.value);
											}
											const filterValues = Array.from(selectedValues);
											column?.setFilterValue(
												filterValues.length ? filterValues : undefined,
											);
										}}
									>
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center border group-hover:border-accent-9 border-gray-11 rounded-[3px]",
												isSelected
													? "bg-black text-white"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<CheckIcon className={cn("h-4 w-4  text-white")} />
										</div>
										{option.icon && <option.icon className="mr-2 h-4 w-4" />}
										<span>{option.label}</span>
										{facets?.get(option.value) && (
											<span className="ml-auto flex h-6 w-6 items-center justify-center font-mono text-lg">
												{facets.get(option.value)}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className="justify-center text-center rounded-b-[7px]"
									>
										Clear filters
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
