import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import CountrySelectComponent from "../CountrySelectComponent";

type Option = { value: string; label: string };

type SelectComponentProps = {
    value: string | undefined;
    onChange: (val: string) => void;
    options: Option[];
    id?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;            // wrapper
    triggerClassName?: string;     // trigger width etc
    contentClassName?: string;     // dropdown panel
};

const SelectComponent: React.FC<SelectComponentProps> = ({
    value,
    onChange,
    options,
    id = "select",
    label,
    placeholder = "Select an option",
    disabled,
    className,
    triggerClassName,
    contentClassName,
}) => {
    return (
        <div className={cn("flex flex-col gap-1 w-full", className)}>
            {label ? <Label htmlFor={id}>{label}</Label> : null}
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger id={id} className={cn("w-full", triggerClassName)}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className={contentClassName}>
                    {options.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SelectComponent;
