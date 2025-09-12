import clsx from 'clsx'
import Image from 'next/image'
import React, { FC } from 'react'

type IProps = {
    source: string,
    alt: string,
    className?: string,
    width: number,
    height: number
}

export const ImageComponent: FC<IProps> = ({ source, alt, className, width, height }) => {
    return (
        <Image src={source} alt={alt} className={clsx(className)} width={width} height={height} />
    )
}