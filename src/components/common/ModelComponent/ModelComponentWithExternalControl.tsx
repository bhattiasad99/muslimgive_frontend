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
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={clsx("sm:max-w-[425px]", dialogContentClassName)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description ? <DialogDescription>
                        {description}
                    </DialogDescription> : null}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default ModelComponentWithExternalControl
