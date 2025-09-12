import Link from 'next/link'
import React, { AnchorHTMLAttributes, FC } from 'react'

type IProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    to: string,
    prefetch?: boolean,
    children: React.ReactNode
}

const LinkComponent: FC<IProps> = ({ to, children, prefetch = true, ...otherProps }) => {
    return (
        <Link href={to} prefetch={prefetch} {...otherProps}>{children}</Link>
    )
}

export default LinkComponent