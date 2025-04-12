"use client";

import { IconBrightness } from "@tabler/icons-react";
import * as React from "react";

import { useFetcher } from "react-router";
import { useUserPreferences } from "~/hooks/use-user-preferences";
import type { Preferences } from "~/root";
import type { action } from "~/routes/action.set-preferences";
import { Button } from "./ui/button";

export function ModeToggle() {
	const { theme } = useUserPreferences();
	const fetcher = useFetcher<typeof action>();
	const toggleTheme = React.useCallback(() => {
		return fetcher.submit(
			{
				theme: theme === "dark" ? "light" : "dark",
			},
			{
				method: "POST",
				action: "/action/set-preferences",
			},
		);
	}, [theme, fetcher]);

	return (
		<Button
			variant="secondary"
			size="icon"
			className="group/toggle size-8"
			onClick={toggleTheme}
		>
			<IconBrightness />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
