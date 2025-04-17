import { useMediaState } from "~/zustand/media";

export function Profile() {
	const openMediaPreview = useMediaState((s) => s.openMediaPreview);
	const previewHeaderImage = () => {
		openMediaPreview([
			// { url: "/header.jpeg", id: "header", alt: "header", type: "image" },
			"/header.jpeg",
		]);
	};

	const previewAvatar = () => {
		openMediaPreview([
			// { url: "/avatar.jpg", id: "avatar", alt: "avatar", type: "image" },
			"/avatar.jpg",
		]);
	};

	return (
		<div className="flex flex-col">
			<button
				type="button"
				className="border-x border-b border-neutral-200 dark:border-neutral-600 z-10 rounded-b-[10px]"
				onClick={previewHeaderImage}
			>
				<img
					className="h-[400px] w-full object-cover rounded-b-[10px] bg-base"
					src="/header.jpeg"
					alt={"header"}
				/>
			</button>

			{/* Content Section */}
			<div className="p-4 -mt-[72px] flex flex-col gap-4">
				<div className="relative">
					<div className="flex justify-between">
						<button
							type="button"
							className="shrink-0 border size-28 border-gray-200 p-[1px] z-20 rounded-[12px]"
							onClick={previewAvatar}
						>
							<img
								src={"/avatar.jpg"}
								width="400"
								height="400"
								draggable="false"
								alt="avatar"
								loading="lazy"
								className="rounded-[10px]"
							/>
						</button>
					</div>

					<div className="flex flex-col gap-1 pt-2">
						<div className="flex gap-2 items-center flex-wrap">
							<h1 className="font-bold text-xl sm:text-2xl">VAN0VICH</h1>
						</div>
					</div>

					<div className="max-h-100 overflow-y-auto pt-2">
						<p className="text-base text-neutral-600 dark:text-neutral-300">
							Hi there, my name is Ivan. I created this website to showcase my
							front-end skills. Feel free to explore. Hope you like it.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
