import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@rocicorp/zero/react";
import { IconCircleCheck, IconLoaderQuarter } from "@tabler/icons-react";
import { schema } from "@work-profile/db";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ulid } from "ulidx";
import { z } from "zod";
import { useIsMobile } from "~/hooks/use-mobile";
import { getErrorMessage } from "~/lib/handle-error";
import { uploadFiles } from "~/lib/uploadthing";
import { useZero } from "~/zero/use-zero";
import { useGlobalState } from "~/zustand/state";
import { FileUploader } from "../file-uploader";
import { Button } from "../ui/button";
import ru from "~/ru.json";
import en from "~/en.json";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useMediaState } from "~/zustand/media";
import { useUserPreferences } from "~/hooks/use-user-preferences";

const entityInputSchema = z.object({
	images: z.array(z.instanceof(File)).optional(),
	title: z.string().min(3, { message: "Too short" }),
	status: z.enum(schema.entityStatuses),
	// Keep Zod schema for final validation
	amount: z
		.number()
		.min(0.1)
		.nonnegative()
		.refine(
			(val) => {
				// Optional: Add specific refinement for max 2 decimal places if needed beyond step attribute
				const decimalPart = String(val).split(".")[1];
				return !decimalPart || decimalPart.length <= 2;
			},
			{ message: "Maximum two decimal places allowed" },
		),
});

type Schema = z.infer<typeof entityInputSchema>;

export function EntityPreview() {
	const isMobile = useIsMobile();
	const open = useGlobalState((s) => s.entityPreview);
	const closeEntityPreview = useGlobalState((s) => s.closeEntityPreview);
	const entityID = useGlobalState((s) => s.entityID);
	const { language } = useUserPreferences();
	const z = useZero();
	const info = language === "en" ? en : ru;
	const [data] = useQuery(z.query.entity.where("id", entityID ?? "").one());
	const [loading, setLoading] = React.useState({
		imageLoading: false,
		loading: false,
	});
	const openMediaPreview = useMediaState((s) => s.openMediaPreview);

	const form = useForm<Schema>({
		resolver: zodResolver(entityInputSchema),
		defaultValues: {
			images: [],
			status: "In progress",
			title: "",
			amount: 0, // Default amount to 0
		},
	});

	const previewImages = React.useCallback(
		(index: number) => {
			data?.images?.length && openMediaPreview(data?.images ?? [], index);
		},
		[data, openMediaPreview],
	);

	React.useEffect(() => {
		if (data) {
			data.title && form.setValue("title", data.title);
			data.status && form.setValue("status", data.status);
			// Convert money (cents) back to decimal for the form
			data.money !== undefined && form.setValue("amount", data.money / 100);
		} else {
			// Reset form if no data (e.g., when switching from edit to add)
			form.reset({
				images: [],
				status: "In progress",
				title: "",
				amount: 0,
			});
		}
	}, [data, form.setValue, form.reset]); // Added entityID dependency for reset

	const setOpen = (val: boolean) => {
		if (!val) {
			closeEntityPreview();
			form.reset();
		}
	};

	const handleNumberInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: { onChange: (value: number) => void },
	) => {
		const value = e.target.value;

		// Special case: if value starts with "0" followed by another digit, remove the leading 0
		if (value.length > 1 && value.startsWith("0") && value[1] !== ".") {
			const newValue = value.substring(1);
			e.target.value = newValue;
			field.onChange(Number.parseFloat(newValue));
			return;
		}

		const numValue = value === "" ? 0 : Number.parseFloat(value);

		if (!Number.isNaN(numValue) && numValue >= 0) {
			// Round the number to 2 decimal places before setting state
			const roundedValue = Math.round(numValue * 100) / 100;
			field.onChange(roundedValue);
		} else if (value === "") {
			// Allow clearing the input
			field.onChange(0);
		}
	};

	// onPaste handler - prevent pasting invalid formats
	const handlePaste = (
		e: React.ClipboardEvent<HTMLInputElement>,
		field: { onChange: (value: number) => void }, // Pass field to potentially update on valid paste
	) => {
		const pastedText = e.clipboardData?.getData("text");

		if (pastedText) {
			// Regex to check if it's a valid number format (allowing decimals)
			const numericRegex = /^-?\d*\.?\d*$/;
			if (!numericRegex.test(pastedText)) {
				// Prevent pasting non-numeric content
				e.preventDefault();
				toast.error("Pasted content is not a valid number.");
				return;
			}

			// Check for more than two decimal places
			const decimalCheckRegex = /\.\d{3,}/; // Matches a dot followed by 3 or more digits
			if (decimalCheckRegex.test(pastedText)) {
				// Prevent pasting numbers with too many decimals
				e.preventDefault();
				toast.error("Cannot paste amount with more than two decimal places.");
				return;
			}

			// Optional: Check if negative number is pasted
			if (Number.parseFloat(pastedText) < 0) {
				e.preventDefault();
				toast.error("Amount cannot be negative.");
				return;
			}
		}
	};

	async function onSubmit(input: Schema) {
		setLoading({ loading: true, imageLoading: false });

		// Handle image uploads once
		let images: string[] | undefined = undefined;
		if (input.images && input.images.length > 0) {
			// Check if images array is present and not empty
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

		setLoading({ loading: true, imageLoading: false }); // Ensure loading is true before mutation

		try {
			// Prepare data common to both create and update
			const entityData = {
				money: Math.round(input.amount * 100), // Convert back to cents
				status: input.status,
				title: input.title,
			};

			if (!entityID) {
				// Create new entity
				const newId = ulid();
				toast.promise(
					z.mutate.entity.insert({
						...entityData,
						id: newId,
						created_at: new Date().toISOString(),
						images: images || [], // Use uploaded images or empty array
					}),
					{
						loading: info.actionResult.creatingEntity,
						success: info.actionResult.entityCreated,
						error: info.actionResult.errorCreatingEntity,
					},
				);
			} else {
				// Update existing entity
				// Combine existing images with new ones
				const updatedImages = [...(data?.images || []), ...(images || [])];
				let noNeedForUpdate = false;

				if (
					entityData.money === data?.money &&
					entityData.status === data?.status &&
					entityData.title === data?.title &&
					updatedImages.length === data.images?.length
				) {
					noNeedForUpdate = true;
				}

				!noNeedForUpdate &&
					toast.promise(
						z.mutate.entity.update({
							id: entityID,
							...entityData,
							// Only include images if new ones were uploaded or existing ones should be kept
							...(images || data?.images ? { images: updatedImages } : {}),
						}),
						{
							loading: info.actionResult.updatingEntity,
							success: info.actionResult.entityUpdated,
							error: info.actionResult.errorUpdatingEntity,
						},
					);
			}
			// Close drawer immediately after initiating the mutation promise
			setOpen(false);
		} catch (err) {
			// Catch potential synchronous errors before the promise
			toast.error(getErrorMessage(err));
			setLoading({ loading: false, imageLoading: false });
		} finally {
			// setLoading(false) will happen when the promise resolves/rejects if using toast.promise
			// However, keep it here in case of synchronous errors caught above
			// Let toast.promise handle final loading state for async operations
			// setLoading({ loading: false, imageLoading: false }); // Maybe remove this if toast.promise handles it well
		}
		setLoading({ imageLoading: false, loading: false });
	}

	return (
		<Drawer
			direction={isMobile ? "bottom" : "right"}
			open={open}
			onOpenChange={setOpen}
		>
			<DrawerContent>
				<DrawerHeader className="gap-1">
					<DrawerTitle>{data?.title ?? info.action.addEntity}</DrawerTitle>
					<DrawerDescription>
						{info.entityPage.addOrEditEntity}
					</DrawerDescription>
				</DrawerHeader>
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
										<FormLabel>{info.common.images}</FormLabel>
										{/* Display existing images if any */}
										{entityID && data?.images && data.images.length > 0 && (
											<div className="mb-2 flex flex-wrap gap-2">
												{data.images.map((imgUrl, index) => (
													// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
													<img
														onClick={() => previewImages(index)}
														key={index}
														src={imgUrl}
														alt={`Entity ${index + 1}`}
														className="h-16 w-16 rounded object-cover"
													/>
												))}
											</div>
										)}
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
									<FormLabel>{info.common.title}</FormLabel>
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
									<FormLabel>{info.common.money}</FormLabel>
									<FormControl>
										<Input
											placeholder="0.00"
											type="number" // Use type="number"
											inputMode="decimal" // Hint for mobile keyboard
											step="0.01" // Allow decimals
											{...field} // Spread field props first
											// Override onChange and value specifically
											value={field.value ?? ""} // Handle potential null/undefined, ensure it's a string for input value prop if needed by Input component or use 0
											onChange={(e) => handleNumberInputChange(e, field)} // Use the simplified handler
											onPaste={(e) => handlePaste(e, field)}
											// Ensure the value passed to the Input is never NaN or invalid for type="number"
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
									<FormLabel>{info.common.status}</FormLabel>
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
				<DrawerFooter>
					{loading.imageLoading && (
						<p className="flex gap-2 text-sm">
							{info.actionResult.savingImages}
						</p>
					)}
					<Button
						type="submit"
						form="entityForm"
						disabled={loading.loading || loading.imageLoading}
					>
						{loading.loading || loading.imageLoading ? (
							<IconLoaderQuarter className="animate-spin" />
						) : (
							<IconCircleCheck />
						)}
						{info.action.save}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
