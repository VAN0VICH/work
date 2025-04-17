import { create } from "zustand";

interface MediaState {
	mediaPreviewList: string[];
	mediaPreviewIndex: number;
	isMediaPreviewOpen: boolean;
	openMediaPreview: (list: string[], index?: number) => void;
	closeMediaPreview: () => void;
	increaseIndex: () => void;
	decreaseIndex: () => void;
	restoreMediaFromState: () => void;
}

export const useMediaState = create<MediaState>((set, get) => ({
	mediaPreviewList: [],
	mediaPreviewIndex: 0,
	isMediaPreviewOpen: false,
	openMediaPreview: (list, index = 0) => {
		set({
			mediaPreviewList: list,
			mediaPreviewIndex: index,
			isMediaPreviewOpen: true,
		});
		history.pushState(
			{
				...history.state,
				mediaPreview: true,
				mediaPreviewList: JSON.stringify(list),
				mediaPreviewIndex: index,
			},
			"",
		);
	},
	closeMediaPreview: () => {
		set({
			isMediaPreviewOpen: false,
			mediaPreviewList: [],
			mediaPreviewIndex: 0,
		});
		// Update history state to reflect modal is closed
		history.pushState(
			{
				...history.state,
				mediaPreview: false,
				mediaPreviewList: null,
				mediaPreviewIndex: null,
			},
			"",
		);
	},
	restoreMediaFromState: () =>
		set({
			mediaPreviewList: history.state?.mediaPreviewList
				? JSON.parse(history.state.mediaPreviewList)
				: [],
			mediaPreviewIndex: history.state?.mediaPreviewIndex ?? 0,
			isMediaPreviewOpen: history.state?.mediaPreview ?? false,
		}),
	increaseIndex: () => {
		const { mediaPreviewList, mediaPreviewIndex } = get();
		if (mediaPreviewIndex < mediaPreviewList.length - 1) {
			const newIndex = mediaPreviewIndex + 1;
			set({ mediaPreviewIndex: newIndex });
			history.pushState(
				{
					...history.state,
					mediaPreview: true,
					mediaPreviewList: JSON.stringify(mediaPreviewList),
					mediaPreviewIndex: newIndex,
				},
				"",
			);
		}
	},
	decreaseIndex: () => {
		const { mediaPreviewIndex } = get();
		if (mediaPreviewIndex > 0) {
			const newIndex = mediaPreviewIndex - 1;
			set({ mediaPreviewIndex: newIndex });
			history.pushState(
				{
					...history.state,
					mediaPreview: true,
					mediaPreviewList: JSON.stringify(get().mediaPreviewList),
					mediaPreviewIndex: newIndex,
				},
				"",
			);
		}
	},
}));
