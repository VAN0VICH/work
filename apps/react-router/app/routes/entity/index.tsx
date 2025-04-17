import React from "react";
import { useNavigate, useSearchParams } from "react-router";
import { EntityPreview } from "~/components/entity/entity-preview";
import { EntityTable } from "~/components/entity/entity-table";
import { Separator } from "~/components/ui/separator";
import { useGlobalState } from "~/zustand/state";

export default function RouteComponent() {
	const setEntityPreview = useGlobalState((state) => state.setEntityPreview);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const entityID = searchParams.get("entityID");

	// Set preview open if entityID is in URL on mount
	React.useEffect(() => {
		if (entityID) {
			setEntityPreview(true);
		}
	}, [entityID, setEntityPreview]);

	const setEntityID = React.useCallback(
		(value: string) => {
			setEntityPreview(true);
			navigate(`?entityID=${encodeURIComponent(value)}`, { replace: false });
		},
		[setEntityPreview, navigate],
	);
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
			<EntityTable setEntityID={setEntityID} />
			<EntityPreview />
		</div>
	);
}
