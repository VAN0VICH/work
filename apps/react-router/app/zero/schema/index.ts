import {
	ANYONE_CAN_DO_ANYTHING,
	createSchema,
	definePermissions,
	type PermissionsConfig,
	type Row,
} from "@rocicorp/zero";
import { entity } from "./entity";

export const schema = createSchema({
	tables: [entity],
});
type AuthData = {
	// The logged-in user.
	sub: string;
};
export type Entity = Row<typeof schema.tables.entity>;
export type Schema = typeof schema;
export const permissions = definePermissions<AuthData, Schema>(schema, () => {
	return {
		entity: ANYONE_CAN_DO_ANYTHING,
		// Other tables are denied by default.
	} satisfies PermissionsConfig<AuthData, Schema>;
});
