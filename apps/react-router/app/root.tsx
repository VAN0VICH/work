import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	type LoaderFunction,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { prefs, userContext } from "./server/sessions.server";
import { z } from "zod";
import { getHints } from "./hooks/use-hints";
import { getDomainUrl } from "./lib/domain";
import { useUserPreferences } from "./hooks/use-user-preferences";
import { MediaModalContainer } from "./components/modal/container";
import { ZeroProvider } from "@rocicorp/zero/react";
import { schema } from "./zero/schema";
import { Zero } from "@rocicorp/zero";
import { Toaster } from "./components/ui/sonner";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export const PreferencesSchema = z.object({
	sidebarState: z.enum(["open", "closed"] as const).optional(),
	theme: z.enum(["inherit", "light", "dark"] as const).optional(),
});
export type Preferences = z.infer<typeof PreferencesSchema>;
export type RootLoaderData = {
	requestInfo: {
		hints: ReturnType<typeof getHints>;
		origin: string;
		path: string;
		userPrefs: Preferences;
		userContext?: {
			tempUserID?: string;
		};
	};
};
export const loader: LoaderFunction = async ({ request }) => {
	const cookieHeader = request.headers.get("Cookie");
	const prefsCookie = (await prefs.parse(cookieHeader)) || {};
	const userContextCookie = (await userContext?.parse(cookieHeader)) || {};
	return {
		requestInfo: {
			hints: getHints(request),
			origin: getDomainUrl(request),
			path: new URL(request.url).pathname,
			userPrefs: {
				theme: prefsCookie.theme,
				sidebarState: prefsCookie.sidebarState,
				accentColor: prefsCookie.accentColor,
				scaling: prefsCookie.scaling,
				grayColor: prefsCookie.grayColor,
			},
			userContext: {
				tempUserID: userContextCookie.tempUserID,
			},
		},
	};
};

export function Layout({ children }: { children: React.ReactNode }) {
	const preferences = useUserPreferences();
	return (
		<html lang="en" className={preferences.theme ?? "light"}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const z = new Zero({
		logLevel: "info",
		server: import.meta.env.VITE_PUBLIC_SERVER,
		userID: "anon",
		schema,
	});
	return (
		<ZeroProvider zero={z}>
			<Outlet />
			<MediaModalContainer />
			<Toaster />
		</ZeroProvider>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
