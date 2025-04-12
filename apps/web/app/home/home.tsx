import { useNavigate } from "react-router";

export function Home() {
	const navigate = useNavigate();
	return <div className="flex flex-1 flex-col gap-4 p-4" />;
}
