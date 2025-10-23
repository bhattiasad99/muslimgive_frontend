"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, CrossIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type Option = { value: string; label: string }

type MultiSelectComboboxProps = {
    id: string
    value: string[]
    onChange: (selections: string[]) => void
    options: Option[]
    placeholder?: string
    className?: string
}

export default function MultiSelectComboboxComponent({
    id,
    value,
    onChange,
    options,
    placeholder = "Select options",
    className,
}: MultiSelectComboboxProps) {
    const [open, setOpen] = React.useState(false)

    const toggle = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter(v => v !== val))
        } else {
            onChange([...value, val])
        }
    }

    const clearAll = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange([])
    }

    const selectedLabels = React.useMemo(() => {
        const map = new Map(options.map(o => [o.value, o.label]))
        return value.map(v => map.get(v) ?? v)
    }, [value, options])

    return (
        <div className={cn("w-full", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        <span className="truncate">
                            {value.length === 0
                                ? placeholder
                                : `${value.length} selected`}
                        </span>
                        <div className="flex items-center gap-2">
                            {value.length > 0 && (
                                <XIcon
                                    className="h-4 w-4 opacity-70 hover:opacity-100"
                                    onClick={clearAll}
                                />
                            )}
                            <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>No results</CommandEmpty>
                            <CommandGroup>
                                {options.map(opt => {
                                    const selected = value.includes(opt.value)
                                    return (
                                        <CommandItem
                                            key={opt.value}
                                            value={opt.label}
                                            onSelect={() => toggle(opt.value)}
                                        >
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selected ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {opt.label}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <div className="flex items-center justify-between border-t p-2">
                        <span className="text-xs text-muted-foreground">
                            {value.length} selected
                        </span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={clearAll}>
                                Clear
                            </Button>
                            <Button size="sm" onClick={() => setOpen(false)}>
                                Done
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            {value.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {value.map((val) => {
                        const label = options.find(o => o.value === val)?.label ?? val
                        return (
                            <Badge key={val} variant="outline" className="bg-gray-100 border-gray-300">
                                <button
                                    type="button"
                                    className="flex gap-2 items-center cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onChange(value.filter(v => v !== val))
                                    }}
                                >
                                    <span>{label}</span>
                                    <XIcon size={14} />
                                </button>
                            </Badge>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
