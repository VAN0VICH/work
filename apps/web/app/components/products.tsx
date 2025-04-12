import type { Entity } from "@work-profile/db";
import React from "react";
import { useGlobalState } from "~/zustand/state";
import { EntityTable } from "./entity-table/table";
import { EntityPreview } from "./ui/entity-preview";

export function Entities({
	entities,
}: {
	entities: Entity[];
}) {
	const setEntityPreview = useGlobalState((state) => state.setEntityPreview);
	const setEntityID_ = useGlobalState((state) => state.setEntityID_);

	const setEnityID = React.useCallback(
		(value: string) => {
			setEntityID_(value);
			setEntityPreview(true);
		},
		[setEntityID_, setEntityPreview],
	);
	function deleteEntity() {}
	return (
		<>
			<EntityTable
				entities={entities}
				deleteEntity={deleteEntity}
				setEntityID={setEnityID}
			/>
			<EntityPreview />
		</>
	);
}
