import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { SiteHeader } from "~/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
export const Route = createFileRoute("/__main")({
	component: Layout,
});

export function Layout() {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="h-14 lg:hidden" />
				<div className="flex flex-1 flex-col">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
