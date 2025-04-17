"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "~/components/ui/carousel";
import { useMediaState } from "~/zustand/media";

export function MediaPreview() {
	const mediaPreviewList = useMediaState((s) => s.mediaPreviewList);
	const mediaPreviewIndex = useMediaState((s) => s.mediaPreviewIndex);
	const setMediaPreviewIndex = useMediaState((s) => s.setPreviewIndex);
	const increaseIndex = useMediaState((s) => s.increaseIndex);
	const decreaseIndex = useMediaState((s) => s.decreaseIndex);

	return (
		<Carousel
			className="w-full"
			opts={{
				startIndex: mediaPreviewIndex,
			}}
			onSelect={(index) => {
				//@ts-ignore
				setMediaPreviewIndex(index);
			}}
		>
			<CarouselContent className="p-0">
				{mediaPreviewList.map((m, index) => (
					<CarouselItem key={index} className="flex justify-center w-fit">
						<img
							src={m || "/placeholder.svg"}
							alt={`img ${index}`}
							className="w-full max-w-[900px] h-auto max-h-[calc(100vh-100px)] object-contain rounded-lg"
						/>
					</CarouselItem>
				))}
			</CarouselContent>
			{mediaPreviewList.length > 1 && (
				<PrevNextButtons
					increaseIndex={increaseIndex}
					decreaseIndex={decreaseIndex}
				/>
			)}
		</Carousel>
	);
}

function PrevNextButtons({
	increaseIndex,
	decreaseIndex,
}: {
	increaseIndex: () => void;
	decreaseIndex: () => void;
}) {
	// useCarousel is now used within the Carousel context
	return (
		<>
			<CarouselPrevious
				onClick={() => {
					decreaseIndex();
				}}
			/>
			<CarouselNext
				onClick={() => {
					increaseIndex();
				}}
			/>
		</>
	);
}
