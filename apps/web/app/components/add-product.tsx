import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { getErrorMessage } from "~/lib/handle-error";
import { uploadFiles } from "~/lib/uploadthing";
import { useGlobalState } from "~/zustand/state";
import { FileUploader } from "./file-uploader";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
type UploadResponse = {
	result: {
		variants: string[];
		filename: string;
		id: string;
	} | null;
	success: boolean;
	errors: {
		message: string;
		code: number;
	}[];
};
const entityInputSchema = z.object({
	images: z.array(z.instanceof(File)).optional(),
	title: z.string(),
});

type Schema = z.infer<typeof entityInputSchema>;
export function AddProduct({
	open,
	setOpen,
	storageID,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	storageID: string;
}) {
	const [loading, setLoading] = React.useState(false);
	const setEntityPreview = useGlobalState((state) => state.setEntityPreview);
	const setEntityID_ = useGlobalState((state) => state.setEntityID_);

	const form = useForm<Schema>({
		//@ts-ignore
		resolver: zodResolver(productInputSchema),
		defaultValues: {
			images: [],
		},
	});
	const [amount, setAmount] = React.useState<number>();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const cleanedValue = e.currentTarget.value.replace(/,/g, "");
		if (cleanedValue === "") {
			setAmount(0); // Optional: You can set it to 0 or handle it differently
			return;
		}

		let value = Number.parseFloat(cleanedValue);
		if (Number.isNaN(value)) {
			value = 0;
		}
		setAmount(value);
	};

	async function onSubmit(input: Schema) {
		setLoading(true);
		console.log("input", input);

		let images: string[] | undefined = undefined;
		if (input.images) {
			try {
				const result = await uploadFiles("videoAndImage", {
					files: input.images,
				});
				images = result.map((r) => r.ufsUrl);
			} catch (err) {
				toast.error(getErrorMessage(err));
				return;
			}
		}

		// toast.promise(
		// 	rep
		// 		? rep.mutate.addProduct({
		// 				product: {
		// 					id: productID,
		// 					baseVariantID: `variant-${productID}-base`,
		// 					createdAt: new Date().toISOString(),
		// 					version: 0,
		// 					title: input.title,
		// 					season: input.season,
		// 					sex: input.sex,
		// 					type: input.type,
		// 					age: input.age,
		// 					...(images && { images }),
		// 					displayID: toSixDigitString(displayID + 1),
		// 					storageID,
		// 					...(amount && {
		// 						price: Math.round(amount * 100),
		// 					}),
		// 				},
		// 				...(size.size && {
		// 					sizes: Array.from(size.entries()).map(([size, quantity]) => ({
		// 						size,
		// 						quantity,
		// 					})),
		// 				}),
		// 			})
		// 		: new Promise((resolve) => resolve(1)),
		// 	{
		// 		success: () => {
		// 			setLoading(false);
		// 			setSize(new Map());
		// 			setOpen(false);
		// 			setProductPreview(true);
		// 			setProductID_(productID);
		// 			form.reset();

		// 			return "Продукт добавлен.";
		// 		},
		// 		error: () => {
		// 			setLoading(false);
		// 			return "Error adding product";
		// 		},
		// 	},
		// );
		setLoading(false);
	}
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					className="w-full h-12 bg-blue-500 text-white text-lg"
					variant="secondary"
				>
					<Plus className="size-7" />
					Добавить продукт
				</Button>
			</SheetTrigger>
			<SheetContent className="w-full">
				<ScrollArea className="h-[calc(100vh-10px)]">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex w-full flex-col gap-6"
						>
							<SheetHeader>
								<SheetTitle>Добавить продукт</SheetTitle>
							</SheetHeader>
							<div className="grid gap-4 p-4">
								<FormField
									control={form.control}
									name="images"
									render={({ field }) => (
										<div className="space-y-6">
											<FormItem className="w-full">
												<FormLabel>Картинки</FormLabel>
												<FormControl>
													<FileUploader
														value={field.value}
														onValueChange={field.onChange}
														maxFileCount={4}
														maxSize={4 * 1024 * 1024}
														// pass the onUpload function here for direct upload
														// onUpload={uploadFiles}
														disabled={loading}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										</div>
									)}
								/>
								<Separator />
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Название</FormLabel>
											<FormControl>
												<Input placeholder="Название" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Separator />
								<div className="grid gap-4">
									<Label htmlFor="name" className="text-right">
										Цена
									</Label>
									<Input
										placeholder="Цена"
										type="number"
										value={amount === 0 ? "" : amount} // Display empty when 0 for easier input
										onChange={handleInputChange}
									/>
								</div>
								<Separator />
							</div>
							<SheetFooter className="flex flex-row justify-between">
								<Button
									type="submit"
									className="w-full h-12 text-lg bg-blue-500"
									disabled={loading}
								>
									{loading && <Loader2 className="animate-spin" />}
									Добавить
								</Button>
								<div className="h-[180px]" />
							</SheetFooter>
						</form>
					</Form>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
