import React, { FC, FormHTMLAttributes } from 'react'
import { TypographyComponent } from '../common/TypographyComponent'
import { ImageComponent } from '../common/ImageComponent'

// Server Action type: function receiving FormData
type ServerAction = (formData: FormData) => void | Promise<void>

type IProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action' | 'children'> & {
    heading: string
    subHeading?: string
    children: React.ReactNode
    action: ServerAction
}

const AuthScreenLayoutComponent: FC<IProps> = ({ heading, subHeading, children, action, ...rest }) => {
    return (
        <>
            <form action={action} className="bg-white p-4 md:p-8 rounded-lg border-[rgba(148,148,148, 0.1)] flex flex-col items-center gap-6 max-w-[528px] min-w-[300px] w-[40vw]" {...rest}>
                <ImageComponent source='/logo__white.png' alt='MuslimGive Logo' height={63} width={252} />
                <div className="flex flex-col gap-1 items-center">
                    <TypographyComponent variant='h4'>
                        {heading}
                    </TypographyComponent>
                    {subHeading ? <TypographyComponent variant='subtitle2' >
                        {subHeading}
                    </TypographyComponent> : null}
                </div>
                <>
                    {children}
                </>
            </form>
        </>
    )
}

export default AuthScreenLayoutComponent