"use client";

import { IconBrightness } from "@tabler/icons-react";
import * as React from "react";

import { useFetcher } from "react-router";
import { Button } from "./ui/button";

export function ModeToggle() {
	const toggleTheme = React.useCallback(() => {}, []);

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
