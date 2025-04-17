// posts.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Profile } from "~/components/profile/profile";

// Note the trailing slash, which is used to target index routes
export const Route = createFileRoute("/__main/")({
	component: IndexComponent,
});

function IndexComponent() {
	return (
		<div className="flex justify-center w-full">
			<div className="max-w-2xl w-full">
				<Profile />
			</div>
		</div>
	);
}
