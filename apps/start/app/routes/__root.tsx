// app/routes/__root.tsx
import type { ReactNode } from "react";
import {
	Outlet,
	createRootRoute,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import appCss from "~/styles/app.css?url";
import { Zero } from "@rocicorp/zero";
import { schema } from "~/zero/schema";
import { ZeroProvider } from "@rocicorp/zero/react";
import { Toaster } from "~/components/ui/sonner";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	const z = new Zero({
		logLevel: "info",
		server: import.meta.env.VITE_PUBLIC_SERVER,
		userID: "anon",
		schema,
	});
	return (
		<RootDocument>
			<ZeroProvider zero={z}>
				<Outlet />
			</ZeroProvider>
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
				<Toaster />
			</body>
		</html>
	);
}
