import { Link, useFetcher, useMatches } from "react-router";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useUserPreferences } from "~/hooks/use-user-preferences";
import type { action } from "~/routes/actions/set-preferences";
import React from "react";

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
					<Language />
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
}
function Language() {
	const { language } = useUserPreferences();
	const fetcher = useFetcher<typeof action>();
	const setLanguage = React.useCallback(
		(lan: "en" | "ru") => {
			return fetcher.submit(
				{ language: lan },
				{
					method: "POST",
					action: "/action/set-preferences",
				},
			);
		},
		[fetcher],
	);
	return (
		<Select
			value={language ?? "ru"}
			onValueChange={(value) => setLanguage(value as "ru" | "en")}
		>
			<SelectTrigger>
				<SelectValue placeholder="Language" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="ru">Ru</SelectItem>
				<SelectItem value="en">En</SelectItem>
			</SelectContent>
		</Select>
	);
}

function Breadcrumbs() {
	const matches = useMatches();
	const { language } = useUserPreferences();

	// Start with the Main prefix
	const breadcrumbs = [
		{ label: language === "ru" ? "Главная" : "Main", path: "/" },
	];

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
