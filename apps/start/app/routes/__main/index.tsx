// posts.index.tsx
import { createFileRoute } from "@tanstack/react-router";

// Note the trailing slash, which is used to target index routes
export const Route = createFileRoute("/__main/")({
	component: IndexComponent,
});

function IndexComponent() {
	return <div>Please select a post!</div>;
}
