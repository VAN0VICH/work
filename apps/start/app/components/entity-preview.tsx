import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useIsMobile } from "~/hooks/use-mobile";
import { useGlobalState } from "~/zustand/state";
import { FileUploader } from "./file-uploader";
import { Button } from "./ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "./ui/drawer";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { schema } from "@work-profile/db";
import type { Entity } from "~/zero/schema";
import { useZero } from "~/zero/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { ulid } from "ulidx";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFiles } from "~/lib/uploadthing";
import { getErrorMessage } from "~/lib/handle-error";

const entityInputSchema = z.object({
	images: z.array(z.instanceof(File)).optional(),
	title: z.string().min(3, { message: "Too short" }),
	status: z.enum(schema.entityStatuses),
	amount: z.number().nonnegative(),
});

type Schema = z.infer<typeof entityInputSchema>;

export function EntityPreview() {
	const isMobile = useIsMobile();
	const open = useGlobalState((s) => s.entityPreview);
	const setOpen_ = useGlobalState((s) => s.setEntityPreview);
	const entityID = useGlobalState((s) => s.entityID);
	const z = useZero();
	const [data] = useQuery(z.query.entity.where("id", entityID ?? "").one());
	const setEntityID = useGlobalState((s) => s.setEntityID_);
	const [loading, setLoading] = React.useState({
		imageLoading: false,
		loading: false,
	});
	const [edit, setEdit] = React.useState(true);

	const form = useForm<Schema>({
		resolver: zodResolver(entityInputSchema),
		defaultValues: {
			images: [],
			status: "In progress",
			title: "",
		},
	});

	React.useEffect(() => {
		if (data) {
			data.title && form.setValue("title", data.title);
			data.status && form.setValue("status", data.status);
		}
	}, [data, form.setValue]);

	const setOpen = (val: boolean) => {
		setOpen_(val);
		setEntityID(null);
		form.reset();
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: { onChange: (value: number | string) => void },
	) => {
		const value = e.currentTarget.value;

		// Handle empty input
		if (value === "") {
			field.onChange(0);
			return;
		}

		// Regular expression to match numbers with up to 2 decimal places
		const regex = /^\d*\.?\d{0,2}$/;

		// Allow valid inputs, including intermediate states like "12."
		if (regex.test(value)) {
			// If the value ends with a dot or is just a dot, update as string temporarily
			if (value === "." || value.endsWith(".")) {
				field.onChange(value); // Update with the string value to show the dot
				return;
			}

			const numValue = Number.parseFloat(value);
			if (!Number.isNaN(numValue)) {
				field.onChange(numValue);
			}
		}
		// If invalid, don't update the field (retains last valid value)
	};

	async function onSubmit(input: Schema) {
		console.log("result", input);
		setLoading({ loading: true, imageLoading: false });

		// Handle image uploads once
		let images: string[] | undefined = undefined;
		if (input.images) {
			setLoading({ loading: true, imageLoading: true });
			try {
				const result = await uploadFiles("imageUploader", {
					files: input.images,
				});
				images = result.map((r) => r.ufsUrl);
			} catch (err) {
				toast.error(getErrorMessage(err));
				setLoading({ loading: false, imageLoading: false });
				return;
			}
		}

		try {
			if (!entityID) {
				// Create new entity
				toast.promise(
					z.mutate.entity.insert({
						id: ulid(),
						created_at: new Date().toISOString(),
						money: Math.round(input.amount * 100),
						status: input.status,
						title: input.title,
						images: images || [],
					}),
					{
						success: "New entity successfully created.",
						error: "Error creating entity.",
					},
				);
			} else {
				// Update existing entity
				toast.promise(
					z.mutate.entity.update({
						id: entityID,
						...(input.status && { status: input.status }),
						...(input.title && { title: input.title }),
						...(input.amount && { money: Math.round(input.amount * 100) }),
						images: [...(data?.images || []), ...(images || [])],
					}),
					{
						success: "Entity updated.",
						error: "Error updating entity.",
					},
				);
			}
			setOpen(false);
		} finally {
			setLoading({ loading: false, imageLoading: false });
		}
	}
	function toggleEdit() {
		setEdit((prev) => !prev);
	}

	const item = {} as Entity | null;

	return (
		<Drawer
			direction={isMobile ? "bottom" : "right"}
			open={open}
			onOpenChange={setOpen}
		>
			<DrawerContent>
				<DrawerHeader className="gap-1">
					<DrawerTitle>{item?.title ?? "Add entity"}</DrawerTitle>
					<DrawerDescription>Add or edit an entity</DrawerDescription>
				</DrawerHeader>
				{edit ? (
					<Form {...form}>
						<form
							id="entityForm"
							className="flex flex-col gap-4 p-4"
							onSubmit={form.handleSubmit(onSubmit)}
						>
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
													disabled={loading.imageLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									</div>
								)}
							/>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="Title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Money</FormLabel>
										<FormControl>
											<Input
												placeholder="Money"
												type="text"
												value={field.value === 0 ? "" : field.value}
												onChange={(e) => handleInputChange(e, field)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger id="status" className="w-full">
													<SelectValue placeholder="Select a status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="In progress">In progress</SelectItem>
												<SelectItem value="Done">Done</SelectItem>
												<SelectItem value="Cancelled">Cancelled</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				) : (
					<NotEditable item={item} />
				)}
				<DrawerFooter>
					{loading.imageLoading && (
						<p className="flex gap-2">
							<Loader2 className="animate-spin" />
							Loading images...
						</p>
					)}
					<Button variant="outline" onClick={toggleEdit}>
						Edit
					</Button>
					<Button
						type="submit"
						form="entityForm"
						disabled={loading.loading || loading.imageLoading}
					>
						{(loading.loading || loading.imageLoading) && (
							<Loader2 className="animate-spin" />
						)}
						Save
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

const NotEditable = ({ item }: { item: Entity | null }) => {
	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex flex-col gap-3">
				<Label>Картинки</Label>
				{item?.images?.length ? (
					<div>images</div>
				) : (
					<div className="h-20 text-slate-500 flex justify-center items-center">
						{" "}
						no images to display
					</div>
				)}
			</div>
			<div className="flex flex-col gap-3">
				<Label>Title</Label>
				<p className="text-slate-500">something</p>
			</div>

			<div className="flex flex-col gap-3">
				<Label htmlFor="header">Money</Label>
				<p className="text-slate-500">money</p>
			</div>
			<div className="flex flex-col gap-3">
				<Label htmlFor="header">Status</Label>
				<p className="text-slate-500">status</p>
			</div>
		</div>
	);
};
