import { Minus, Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "~/components/ui/carousel";
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "~/components/ui/drawer";
import { cn } from "~/lib/utils";
import { useGlobalState } from "~/zustand/state";
import { Badge } from "./badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";
import { Separator } from "./separator";
import { Input } from "./input";
import type { Entity } from "@work-profile/db";

export function EntityPreview() {
	const entityID = useGlobalState((state) => state.entityID);
	const entityPreview = useGlobalState((state) => state.entityPreview);
	const entity = null as Entity | null;
	const setEntityPreview = useGlobalState((state) => state.setEntityPreview);
	const onDelete = React.useCallback(async () => {
		toast.success("Product deleted.");
		setEntityPreview(false);
	}, [setEntityPreview]);

	return (
		<>
			<Dialog open={entityPreview} onOpenChange={setEntityPreview}>
				<DialogContent className="sm:max-w-[425px] h-[calc(100%-30px)] p-3">
					<div className="grid py-4">
						<ImagesCarousel images={entity?.images ?? []} />
						<Separator />
						<div className="flex gap-4 items-center">
							<p className="w-[100px] text-sm text-gray-600">Number</p>
							<p> {1}</p>
						</div>
					</div>
					<DialogFooter className="flex justify-between items-end flex-row w-full">
						<Button type="submit" className=" bg-green-600">
							Продать
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

export function ImagesCarousel({ images }: { images: string[] }) {
	return (
		<Carousel className="w-full max-w-xs">
			<CarouselContent>
				{images.map((img) => (
					<CarouselItem key={img}>
						<div className="p-1 flex justify-center">
							<img src={img} alt="product" className="size-[200px]" />
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}

export function DeleteConfirmation({
	onDelete,
}: {
	onDelete: () => Promise<void>;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="destructive">Удалить</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Удалить навсегда</DrawerTitle>
						<DrawerDescription>Продукт будет удален.</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						{" "}
						<Button
							onClick={onDelete}
							variant="destructive"
							className="h-12 text-lg"
						>
							Подтвердить
						</Button>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
