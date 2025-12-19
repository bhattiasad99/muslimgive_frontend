import Link from 'next/link'
import React, { AnchorHTMLAttributes, FC } from 'react'

type IProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    to: string,
    prefetch?: boolean,
    children: React.ReactNode,
    openInNewTab?: boolean
}

const LinkComponent: FC<IProps> = ({ to, children, prefetch = true, openInNewTab = false, ...otherProps }) => {
    return (
        <Link href={to} prefetch={prefetch} {...otherProps} target={openInNewTab ? "_blank" : undefined} rel={openInNewTab ? "noopener noreferrer" : undefined}>{children}</Link>
    )
}

export default LinkComponent