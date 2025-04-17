import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	route("/api/uploadthing", "routes/api/uploadthing.ts"),
	route("/action/set-preferences", "routes/actions/set-preferences.ts"),
	layout("routes/layout.tsx", [
		index("routes/home.tsx"),
		...prefix("entity", [index("routes/entity/index.tsx")]),
	]),
] satisfies RouteConfig;
