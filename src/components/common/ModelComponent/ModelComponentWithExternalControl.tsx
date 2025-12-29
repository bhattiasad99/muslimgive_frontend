"use client"
import React, { FC, ReactNode, useId } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import clsx from "clsx"

import type { FC, ReactNode } from "react"

type ModelComponentWithExternalControlProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    title: string,
    description?: string,
    children: ReactNode,
    dialogContentClassName?: string,
}

const ModelComponentWithExternalControl: FC<ModelComponentWithExternalControlProps> = ({ open, onOpenChange, title, description, children, dialogContentClassName }) => {
    const descriptionId = useId();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={description ? descriptionId : undefined} className={clsx("sm:max-w-[425px]", dialogContentClassName)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description ? <DialogDescription id={descriptionId}>
                        {description}
                    </DialogDescription> : null}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default ModelComponentWithExternalControl
