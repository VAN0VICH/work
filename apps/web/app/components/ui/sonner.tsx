import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useUserPreferences } from "~/hooks/use-user-preferences";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme } = useUserPreferences();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			position="bottom-left"
			duration={1500}
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
