import type { Entity } from "@work-profile/db";
import { Entities } from "~/components/products";

export default function EntityPage() {
	const entities = [] as Entity[];
	return (
		<div className="p-4">
			<Entities entities={entities} />
		</div>
	);
}
