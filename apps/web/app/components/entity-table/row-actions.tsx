import type { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import type { Entity } from "@work-profile/db";

interface DataTableRowActionsProps {
	row: Row<Entity>;
	deleteEntity: (keys: string[]) => void;
}

export function RowActions({ row, deleteEntity }: DataTableRowActionsProps) {
	return (
		<div className="flex justify-end">
			<Button
				className="bg-blue-500"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					deleteEntity([row.original.id]);
				}}
			>
				<Trash className="size-5" />
			</Button>
		</div>
	);
}
