import { parseWithZod } from "@conform-to/zod";
import {
	PreferencesSchema,
	type Preferences,
	type RootLoaderData,
} from "~/root";
import { useHints } from "./use-hints";
import { useFetchers, useRouteLoaderData } from "react-router";
export function useUserPreferences(): Preferences {
	const data = useRouteLoaderData<RootLoaderData>("root");
	const hints = useHints();
	const optimisticUpdates = useOptimisticUserPreferences();
	return {
		...(data?.requestInfo.userPrefs as Preferences),
		theme:
			optimisticUpdates?.theme ??
			data?.requestInfo.userPrefs.theme ??
			hints?.theme,
		...(optimisticUpdates?.sidebarState && {
			sidebarState: optimisticUpdates.sidebarState,
		}),
	};
}

export function useOptimisticUserPreferences() {
	const fetchers = useFetchers();
	const preferences = fetchers.find(
		(f) => f.formAction === "/action/set-preferences",
	);
	if (preferences?.formData) {
		const submission = parseWithZod(preferences.formData, {
			schema: PreferencesSchema,
		});

		if (submission.status === "success") {
			return submission.value;
		}
	}
}
