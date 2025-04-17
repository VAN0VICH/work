import { create } from "zustand";

interface State {
	entityID: string | null;
	setEntityID: (value: string | null) => void;
	entityPreview: boolean;
	openEntityPreview: (id: string | null) => void;
	closeEntityPreview: () => void;
	restoreEntityFromState: () => void;
}

export const useGlobalState = create<State>((set) => ({
	entityID: null,
	setEntityID: (value) => set({ entityID: value }),
	entityPreview: false,
	openEntityPreview: (id) => {
		set({
			entityPreview: true,
			entityID: id,
		});
		const url = id ? `/entity?entityID=${id}` : "/entity";
		history.pushState(
			{
				...history.state,
				entityPreview: true,
				entityID: id,
			},
			"",
			url,
		);
	},
	closeEntityPreview: () => {
		set({
			entityPreview: false,
			entityID: null,
		});
		history.pushState(
			{
				...history.state,
				entityPreview: false,
				entityID: null,
			},
			"",
			"/entity",
		);
	},
	restoreEntityFromState: () =>
		set({
			entityPreview: history.state?.entityPreview,
			entityID: history.state?.entityID,
		}),
}));
