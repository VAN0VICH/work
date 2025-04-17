import { createRouteHandler, createUploadthing } from "uploadthing/remix";
import type { FileRouter } from "uploadthing/types";

const f = createUploadthing();

const uploadRouter = {
	imageUploader: f({
		image: { maxFileSize: "8MB", maxFileCount:6 },
		video: { maxFileSize: "16MB" },
	}).onUploadComplete(async ({ file }) => {
		console.log("file url", file.ufsUrl);
	}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

const handlers = createRouteHandler({ router: uploadRouter });

export const loader = handlers.loader;
export const action = handlers.action;
