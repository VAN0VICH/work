import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	useCarousel,
} from "~/components/ui/carousel";
import { useMediaState } from "~/zustand/media";

export function MediaPreview() {
	const mediaPreviewList = useMediaState((s) => s.mediaPreviewList);

	const mediaPreviewIndex = useMediaState((s) => s.mediaPreviewIndex);
	return (
		<Carousel className="w-full" tabIndex={mediaPreviewIndex}>
			<CarouselContent>
				{mediaPreviewList.map((m, index) => (
					<CarouselItem key={index} className="flex justify-center w-fit">
						<img
							src={m}
							alt={`img ${index}`}
							className="md:min-w-[800px] rounded-xl"
						/>
					</CarouselItem>
				))}
			</CarouselContent>
			{mediaPreviewList.length > 1 && <PrevNextButtons />}
		</Carousel>
	);
}

function PrevNextButtons() {
	const { scrollPrev, canScrollPrev, canScrollNext, scrollNext } =
		useCarousel();

	const increaseIndex = useMediaState((s) => s.increaseIndex);
	const decreaseIndex = useMediaState((s) => s.decreaseIndex);

	function next() {
		if (canScrollNext) {
			increaseIndex();
			scrollNext();
		}
	}

	function prev() {
		if (canScrollPrev) {
			decreaseIndex();
			scrollPrev();
		}
	}
	return (
		<>
			<CarouselPrevious onClick={prev} />
			<CarouselNext onClick={next} />
		</>
	);
}
