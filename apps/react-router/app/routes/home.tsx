import { Profile } from "~/components/profile/profile";

export function meta() {
	return [
		{ title: "VAN0VICH" },
		{ name: "description", content: "VAN0VICH's page" },
	];
}

export default function IndexComponent() {
	return (
		<div className="flex justify-center w-full">
			<div className="max-w-2xl w-full">
				<Profile />
			</div>
		</div>
	);
}
