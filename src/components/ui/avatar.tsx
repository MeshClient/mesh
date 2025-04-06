import * as React from "react"
import {cn} from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "xxs" | "xs" | "sm" | "md" | "lg"
    fallback?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({className, children, size = "md", ...props}, ref) => {
        const sizeClasses = {
            xxs: "h-3 w-3",
            xs: "h-5 w-5",
            sm: "h-6 w-6",
            md: "h-10 w-10",
            lg: "h-14 w-14"
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex shrink-0 overflow-hidden rounded-full bg-secondary",
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement>
>(({className, alt, onError, ...props}, ref) => {
    const [hasError, setHasError] = React.useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        if (onError) onError(e);
    };

    if (hasError) {
        return null;
    }

    return (
        <img
            ref={ref}
            className={cn("aspect-square h-full w-full", className)}
            alt={alt}
            onError={handleError}
            {...props}
        />
    );
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center",
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = "AvatarFallback"


export {Avatar, AvatarImage, AvatarFallback}