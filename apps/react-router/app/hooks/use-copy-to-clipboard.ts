import React from "react";

export const useCopyToClipboard = () => {
	const [copied, setCopied] = React.useState(false);

	const copy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
			return true;
		} catch (error) {
			console.error("Failed to copy:", error);
			return false;
		}
	};

	return { copied, copy };
};
