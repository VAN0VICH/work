import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/entities/")({
	component: Entities,
});

function Entities() {
	return <div>Hello what</div>;
}
