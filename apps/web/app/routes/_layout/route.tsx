import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
	component: LayoutComponent,
});

function LayoutComponent() {
	return (
		<div>
			<div className="size-20 bg-red-500">w</div>
			yo
			<Outlet />
		</div>
	);
}
