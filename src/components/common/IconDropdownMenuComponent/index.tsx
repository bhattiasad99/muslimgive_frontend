import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import clsx from 'clsx';
import { Button } from '@/components/ui/button';

type Option = {
    value: string,
    label: React.ReactNode
}

type IProps = {
    icon: React.ReactNode,
    options: Option[],
    onSelect?: (selection: string) => void;
    className?: string
}

const IconDropdownMenuComponent: React.FC<IProps> = ({ className, icon, options, onSelect }) => {
    return <DropdownMenu >
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className={clsx(className)}
            >
                {icon}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
            {options.map(eachOpt => <DropdownMenuLabel

                key={eachOpt.value}>
                <DropdownMenuItem onClick={() => {
                    if (onSelect) {
                        onSelect(eachOpt.value)
                    }
                }}>{eachOpt.label}</DropdownMenuItem>

            </DropdownMenuLabel>)}
        </DropdownMenuContent>
    </DropdownMenu>
};

export default IconDropdownMenuComponent;