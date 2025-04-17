"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import ru from "~/ru.json";
import en from "~/en.json";
import { useUserPreferences } from "~/hooks/use-user-preferences";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { copy } = useCopyToClipboard();
	const { language } = useUserPreferences();
	const info = language === "en" ? en : ru;

	const copyEmail = () => {
		copy("van0vich.mail@gmail.com");
		toast.success(info.actionResult.emailCopied);
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					onClick={copyEmail}
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-lg grayscale">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className="rounded-lg">CN</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{user.name}</span>
						<span className="text-muted-foreground truncate text-xs">
							{user.email}
						</span>
					</div>
					<IconDotsVertical className="ml-auto size-4" />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
