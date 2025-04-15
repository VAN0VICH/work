import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { EntityPreview } from "~/components/entity-preview";
import { EntityTable } from "~/components/entity-table";
import { useGlobalState } from "~/zustand/state";

export const Route = createFileRoute("/__main/entity/")({
	component: RouteComponent,
});

function RouteComponent() {
	const setEntityPreview = useGlobalState((state) => state.setEntityPreview);
	const setEntityID_ = useGlobalState((state) => state.setEntityID_);

	const setEntityID = React.useCallback(
		(value: string) => {
			setEntityID_(value);
			setEntityPreview(true);
		},
		[setEntityID_, setEntityPreview],
	);
	function deleteEntity() {}
	return (
		<div>
			<EntityTable deleteEntity={deleteEntity} setEntityID={setEntityID} />
			<EntityPreview />
		</div>
	);
}
