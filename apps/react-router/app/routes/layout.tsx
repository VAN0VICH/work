import { Outlet } from "react-router";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { SiteHeader } from "~/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export default function Layout() {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset className="dark:bg-neutral-800 dark:border">
				<SiteHeader />
				<div className="h-14 lg:hidden" />
				<div className="flex flex-1 flex-col">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
