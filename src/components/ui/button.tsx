/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-neutral-950 focus-visible:ring-neutral-950/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:focus-visible:border-neutral-300 dark:focus-visible:ring-neutral-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 cursor-pointer",
    {
        variants: {
            variant: {
                default:
                    "bg-neutral-900 text-neutral-50 shadow-xs hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
                destructive:
                    "bg-red-500 text-white shadow-xs hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-500/60 dark:bg-red-900 dark:hover:bg-red-900/90 dark:focus-visible:ring-red-900/20 dark:dark:focus-visible:ring-red-900/40 dark:dark:bg-red-900/60",
                outline:
                    "border bg-white shadow-xs hover:bg-neutral-100 hover:text-neutral-900 dark:bg-neutral-200/30 dark:border-neutral-200 dark:hover:bg-neutral-200/50 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:dark:bg-neutral-800/30 dark:dark:border-neutral-800 dark:dark:hover:bg-neutral-800/50",
                secondary:
                    "bg-neutral-100 text-neutral-900 shadow-xs hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
                ghost:
                    "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-100/50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:dark:hover:bg-neutral-800/50",
                link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50",
                primary: "bg-primary text-primary-foreground"
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

type ButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
        loading?: boolean
    }

function Button({
    className,
    variant,
    size,
    loading,
    disabled: disabledProps,
    asChild = false,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button"

    const isDisabled = Boolean(loading || disabledProps)

    // Prevent clicks when loading even if rendered asChild
    const onClick =
        isDisabled
            ? (e: React.MouseEvent) => {
                e.preventDefault()
                e.stopPropagation()
            }
            : props.onClick

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            aria-disabled={isDisabled || undefined}
            // Only set the native disabled attribute when it's an actual <button>
            {...(!asChild ? { disabled: isDisabled } : {})}
            {...props}
            onClick={onClick}
        >
            {loading && (
                <LoaderCircle
                    aria-hidden="true"
                    className={cn(
                        "animate-spin",
                        // keep icon sizes aligned with button size variants
                        size === "sm" ? "size-3.5" : size === "lg" ? "size-4.5" : "size-4"
                    )}
                />
            )}
            {props.children}
        </Comp>
    )
}

export { Button, buttonVariants }
export type { ButtonProps }
