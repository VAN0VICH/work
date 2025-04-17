import { create } from "zustand";

interface State {
	entityPreview: boolean;
	setEntityPreview: (value: boolean) => void;
}

export const useGlobalState = create<State>((set) => ({
	entityPreview: false,
	setEntityPreview: (value) => set({ entityPreview: value }),
}));
