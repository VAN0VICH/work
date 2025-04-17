"use client";

import * as React from "react";
import { IconBrightness, type Icon } from "@tabler/icons-react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { Switch } from "~/components/ui/switch";
import { useFetcher } from "react-router";
import { useUserPreferences } from "~/hooks/use-user-preferences";
import type { action } from "~/routes/actions/set-preferences";

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: Icon;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const [mounted, setMounted] = React.useState(false);
	const { language } = useUserPreferences();

	const fetcher = useFetcher<typeof action>();
	const { theme } = useUserPreferences();
	const toggleTheme = React.useCallback(() => {
		fetcher.submit(
			{ theme: theme === "dark" ? "light" : "dark" },
			{
				method: "POST",
				action: "/action/set-preferences",
			},
		);
	}, [theme, fetcher]);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{/* {items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild>
								<a href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))} */}
					<SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
						<SidebarMenuButton asChild>
							{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
							<label>
								<IconBrightness />
								<span>{language === "en" ? "Dark Mode" : "Темный режим"}</span>
								{mounted ? (
									<Switch
										className="ml-auto"
										checked={theme !== "light"}
										onCheckedChange={toggleTheme}
									/>
								) : (
									<Skeleton className="ml-auto h-4 w-8 rounded-full" />
								)}
							</label>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
