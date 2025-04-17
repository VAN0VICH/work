import { useEffect } from "react";
import { useMediaState } from "~/zustand/media";
import { Dialog, DialogContent } from "../ui/dialog";
import { MediaPreview } from "./media-preview";

export function MediaModalContainer() {
	const opened = useMediaState((s) => s.isMediaPreviewOpen);
	const closeMediaPreview = useMediaState((s) => s.closeMediaPreview);
	const restoreMediaPreviewFromState = useMediaState(
		(s) => s.restoreMediaFromState,
	);

	const onOpenChange = (val: boolean) => {
		if (!val) {
			closeMediaPreview();
		}
	};

	useEffect(() => {
		// Add popstate listener
		window.addEventListener("popstate", restoreMediaPreviewFromState);
		// Initial restore
		restoreMediaPreviewFromState();

		// Cleanup listener on unmount
		return () => {
			window.removeEventListener("popstate", restoreMediaPreviewFromState);
		};
	}, [restoreMediaPreviewFromState]);

	return (
		<Dialog open={opened} onOpenChange={onOpenChange}>
			<DialogContent className="bg-transparent border-none shadow-none w-full">
				<MediaPreview />
			</DialogContent>
		</Dialog>
	);
}
