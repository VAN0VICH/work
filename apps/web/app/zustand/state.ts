import { create } from "zustand";

interface State {
	entityID: string | null;
	setEntityID_: (value: string) => void;
	entityPreview: boolean;
	setEntityPreview: (value: boolean) => void;
}

export const useGlobalState = create<State>((set) => ({
	entityID: null,
	setEntityID_: (value) => set({ entityID: value }),
	entityPreview: false,
	setEntityPreview: (value) => set({ entityPreview: value }),
}));
