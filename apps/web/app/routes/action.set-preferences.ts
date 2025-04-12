import { parseWithZod } from "@conform-to/zod";
import { invariantResponse } from "@epic-web/invariant";
import type { ActionFunctionArgs } from "react-router";
import { PreferencesSchema } from "~/root";
import { prefs } from "~/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
	const cookieHeader = request.headers.get("Cookie");
	const cookie = (await prefs.parse(cookieHeader)) || {};
	const formData = await request.formData();
	const submission = parseWithZod(formData, {
		schema: PreferencesSchema,
	});

	invariantResponse(
		submission.status === "success",
		"Invalid preference received",
	);
	const { sidebarState, theme } = submission.value;
	if (sidebarState) {
		cookie.sidebarState = sidebarState;
	}
	if (theme) {
		cookie.theme = theme;
	}
	const maxAge = theme === "inherit" ? -1 : 31536000;

	return Response.json(
		{ result: submission.reply() },
		{
			headers: {
				"Set-Cookie": await prefs.serialize(cookie, {
					maxAge,
					path: "/",
					httpOnly: true,
				}),
			},
		},
	);
}
