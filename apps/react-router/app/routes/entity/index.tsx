import React from "react";
import { useSearchParams } from "react-router";
import { EntityPreview } from "~/components/entity/entity-preview";
import { EntityTable } from "~/components/entity/entity-table";
import { Separator } from "~/components/ui/separator";
import { useGlobalState } from "~/zustand/state";

export default function RouteComponent() {
	const [searchParams] = useSearchParams();
	const entityID = searchParams.get("entityID");
	const openEntityPreview = useGlobalState((state) => state.openEntityPreview);
	const restoreEntityFromState = useGlobalState(
		(s) => s.restoreEntityFromState,
	);

	React.useEffect(() => {
		if (entityID) {
			openEntityPreview(entityID);
		}
	}, [entityID, openEntityPreview]);
	React.useEffect(() => {
		// Add popstate listener
		window.addEventListener("popstate", restoreEntityFromState);
		// Initial restore
		restoreEntityFromState();

		// Cleanup listener on unmount
		return () => {
			window.removeEventListener("popstate", restoreEntityFromState);
		};
	}, [restoreEntityFromState]);

	return (
		<div>
			<div className="p-4">
				<h1 className="font-semibold text-xl">CRUD app</h1>
				<p className="text-sm text-neutral-600 dark:text-neutral-300">
					Simple and fast CRUD (create, read, update, delete) app with image
					uploading.
				</p>
			</div>
			<Separator />
			<EntityTable />
			<EntityPreview />
		</div>
	);
}
