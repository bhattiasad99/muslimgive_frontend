"use client"

import * as React from "react"
import type { CheckedState } from "@radix-ui/react-checkbox"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type CheckboxComponentProps = {
    id?: string
    label?: React.ReactNode
    description?: React.ReactNode
    checked: CheckedState
    onCheckedChange: (checked: CheckedState) => void
    disabled?: boolean
    required?: boolean
    className?: string           // wrapper
    checkboxClassName?: string   // checkbox element
    labelClassName?: string      // main label
    descriptionClassName?: string
}

export function CheckboxComponent({
    id,
    label,
    description,
    checked,
    onCheckedChange,
    disabled,
    required,
    className,
    checkboxClassName,
    labelClassName,
    descriptionClassName,
}: CheckboxComponentProps) {
    const generatedId = React.useId()
    const checkboxId = id ?? generatedId

    return (
        <div className={cn("flex items-start gap-3", className)}>
            <Checkbox
                id={checkboxId}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                required={required}
                className={checkboxClassName}
                aria-required={required}
            />
            {(label || description) ? (
                <div className="grid gap-1.5 leading-none">
                    {label ? (
                        <Label
                            htmlFor={checkboxId}
                            className={cn("text-sm font-medium", labelClassName)}
                        >
                            {label}
                            {required ? <span className="text-destructive">*</span> : null}
                        </Label>
                    ) : null}
                    {description ? (
                        <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>
                            {description}
                        </p>
                    ) : null}
                </div>
            ) : null}
        </div>
    )
}
