import { generateReactHelpers } from "@uploadthing/react";
import type { UploadRouter } from "~/routes/uploadthing";

export const { useUploadThing, uploadFiles } =
	generateReactHelpers<UploadRouter>();
