'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { FC, useId } from "react";

type Icon = {
    direction?: "left" | "right";
    component: React.ReactNode;
};

type IProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    id?: string;
    icon?: Icon;
    containerClassName?: string; // optional wrapper styling
};

export const TextFieldComponent: FC<IProps> = ({
    type = "text",
    name,
    label,
    placeholder,
    id,
    icon,
    className,
    containerClassName,
    ...props
}) => {
    const reactId = useId();
    const inputId = id ?? reactId;

    const dir = icon?.direction ?? "left";
    const hasLeft = !!icon && dir === "left";
    const hasRight = !!icon && dir === "right";

    return (
        <div className={cn("flex w-full flex-col gap-1", containerClassName)}>
            {label ? (
                <Label className="text-sm" htmlFor={inputId}>
                    {label}
                </Label>
            ) : null}

            <div className="relative">
                {hasLeft && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                        {icon!.component}
                    </span>
                )}
                {hasRight && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        {icon!.component}
                    </span>
                )}

                <Input
                    id={inputId}
                    name={name}
                    type={type}
                    placeholder={placeholder ?? ""}
                    className={cn(
                        hasLeft && "pl-9",
                        hasRight && "pr-9",
                        className
                    )}
                    {...props}
                />
            </div>
        </div>
    );
};
