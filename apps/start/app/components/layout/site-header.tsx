import { Link, useMatches } from "@tanstack/react-router";
import { ModeToggle } from "../mode-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export function SiteHeader() {
	return (
		<header className="flex lg:rounded-t-xl backdrop-blur-sm z-50 shrink-0 fixed w-full lg:relative h-14 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumbs />
				<div className="ml-auto flex items-center gap-2">
					<Button variant="ghost" asChild size="sm" className="hidden sm:flex">
						<a
							href="https://github.com/VAN0VICH/work"
							rel="noopener noreferrer"
							target="_blank"
							className="dark:text-foreground"
						>
							GitHub
						</a>
					</Button>
					<ModeToggle />
				</div>
			</div>
		</header>
	);

	function Breadcrumbs() {
		const matches = useMatches();

		// Start with the Main prefix
		const breadcrumbs = [{ label: "Главная", path: "/" }];

		// Build the full path structure
		let currentPath = "";

		matches
			.filter((match) => Boolean(match.pathname) && match.pathname !== "/")
			.forEach((match) => {
				// Get the new segments added by this route
				const currentSegments = match.pathname
					.replace(currentPath, "")
					.split("/")
					.filter(Boolean);

				currentSegments.forEach((segment) => {
					// Update current path
					currentPath = `${currentPath}/${segment}`;

					// Determine the label
					const label = segment;

					breadcrumbs.push({
						label,
						path: currentPath,
					});
				});
			});

		return (
			<Breadcrumb>
				<BreadcrumbList>
					{breadcrumbs.map((crumb, index) => (
						<BreadcrumbItem key={crumb.path}>
							{index < breadcrumbs.length - 1 ? (
								<>
									<Link to={crumb.path} className="text-sm">
										{crumb.label}
									</Link>
									<BreadcrumbSeparator />
								</>
							) : (
								<BreadcrumbPage className="text-sm font-semibold">
									{crumb.label}
								</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		);
	}
}
