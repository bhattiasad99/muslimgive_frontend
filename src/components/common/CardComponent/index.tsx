import React, { FC } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from '@/lib/utils'

type IProps = {
    heading?: string,
    description?: string,
    children: React.ReactNode,
    footer?: React.ReactNode,
    className?: string,
    withShadow?: boolean,
    extraRounded?: boolean
}

const CardComponent: FC<IProps> = ({ className, children, heading, description, footer, withShadow = true, extraRounded = false }) => {
    return (
        <Card className={cn('border-[#BBC9DE/40] rounded-lg', withShadow ? 'shadow-md' : 'shadow-none', extraRounded ? "rounded-[16px]" : "rounded-lg", className)}>
            {(heading || description) ? <CardHeader>
                {heading ? <CardTitle>{heading}</CardTitle> : null}
                {description ? <CardDescription>{description}</CardDescription> : null}
            </CardHeader> : null}
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                {footer}
            </CardFooter>
        </Card>
    )
}

export default CardComponent