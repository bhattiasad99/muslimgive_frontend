'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { randomUUID } from "crypto"
import { FC, useId } from "react"
import { Icon } from "."
import { cn } from "@/lib/utils"

type IProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string,
    id?: string | null,
    placeholder?: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    icon?: Icon;
}

export const ControlledTextFieldComponent: FC<IProps> = ({ type = "text", value, onChange, name, label, placeholder, id, onBlur, icon, className, ...rest }) => {

    const reactId = useId();
    const getId = id ?? reactId;

    const dir = icon?.direction ?? "left";
    const hasLeft = !!icon && dir === "left";
    const hasRight = !!icon && dir === "right";

    return (
        <div className="flex flex-col w-full items-center gap-1">
            {label ? <Label className="w-full text-sm" htmlFor={getId}>{label}</Label> : null}
            <div className="relative w-full">
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
                <Input onBlur={() => {
                    if (onBlur) {
                        onBlur()
                    }
                }} name={name} value={value} onChange={onChange} className={cn("w-full",
                    hasLeft && "pl-9",
                    hasRight && "pr-9",
                    className
                )} type={type} id={getId} placeholder={placeholder ?? ""}
                    {...rest}
                />
            </div>
        </div>
    )
}