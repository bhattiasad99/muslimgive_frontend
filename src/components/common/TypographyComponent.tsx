import clsx from 'clsx'
import React, { FC } from 'react'

type IProps = {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline' | 'button',
    children: React.ReactNode,
    className?: string
}

export const TypographyComponent: FC<IProps> = ({ variant = 'body1', children, className }) => {
    const commonClassNames = ''
    const classes = {
        h1: clsx('text-2xl font-semibold', commonClassNames, className),
        h2: clsx('text-xl font-semibold', commonClassNames, className),
        h3: clsx('text-2xl font-semibold', commonClassNames, className),
        h4: clsx('text-[20px] font-semibold', commonClassNames, className),
        h5: clsx('text-lg font-semibold', commonClassNames, className),
        h6: clsx('text-base font-semibold', commonClassNames, className),
        subtitle1: clsx('text-base font-medium', commonClassNames, className),
        subtitle2: clsx('text-sm font-normal text-subtitle', commonClassNames, className),
        body1: clsx('text-base font-normal', commonClassNames, className),
        body2: clsx('text-sm font-normal', commonClassNames, className),
        caption: clsx('text-xs font-normal', commonClassNames, className),
        overline: clsx('text-xs font-medium uppercase', commonClassNames, className),
        button: clsx('text-sm font-medium uppercase', commonClassNames, className),
    }
    switch (variant) {
        case 'h1':
            return <h1 className={classes.h1}>{children}</h1>
        case 'h2':
            return <h2 className={classes.h2}>{children}</h2>
        case 'h3':
            return <h3 className={classes.h3}>{children}</h3>
        case 'h4':
            return <h4 className={classes.h4}>{children}</h4>
        case 'h5':
            return <h5 className={classes.h5}>{children}</h5>
        case 'h6':
            return <h6 className={classes.h6}>{children}</h6>
        case 'subtitle1':
            return <h6 className={classes.subtitle1}>{children}</h6>
        case 'subtitle2':
            return <h6 className={classes.subtitle2}>{children}</h6>
        case 'body1':
            return <p className={classes.body1}>{children}</p>
        case 'body2':
            return <p className={classes.body2}>{children}</p>
        case 'caption':
            return <span className={classes.caption}>{children}</span>
        case 'overline':
            return <span className={classes.overline}>{children}</span>
        case 'button':
            return <span className={classes.button}>{children}</span>
    }
}
