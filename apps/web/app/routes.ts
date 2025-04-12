import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	route("/api/uploadthing", "routes/uploadthing.ts"),
	route("/action/set-preferences", "routes/action.set-preferences.ts"),
	layout("routes/home/layout.tsx", [
		index("routes/home/home.tsx"),
		...prefix("entities", [index("routes/entities/index.tsx")]),
	]),
] satisfies RouteConfig;
