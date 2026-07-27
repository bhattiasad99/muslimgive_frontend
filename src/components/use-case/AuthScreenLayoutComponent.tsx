import React, { FC, FormHTMLAttributes } from 'react'
import { TypographyComponent } from '../common/TypographyComponent'
import { ImageComponent } from '../common/ImageComponent'
import LinkComponent from '../common/LinkComponent'

// Server Action type: function receiving FormData
type ServerAction = (formData: FormData) => void | Promise<void>

type IProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action' | 'children'> & {
    heading: string
    subHeading?: string
    children: React.ReactNode
    action: ServerAction
}

const LOGO_SRC = '/zakat-advisory-logos/logo-transparent.png'

const AuthScreenLayoutComponent: FC<IProps> = ({ heading, subHeading, children, action, ...rest }) => {
    return (
        <>
            <form action={action} className="bg-white p-4 md:p-8 rounded-lg border-[rgba(148,148,148, 0.1)] flex flex-col items-center gap-6 w-full max-w-[528px] sm:min-w-[300px] sm:w-[70vw] md:w-[40vw]" {...rest}>
                <LinkComponent to="/charities" className="flex w-full justify-center">
                    <ImageComponent
                        source={LOGO_SRC}
                        alt="Zakah Advisor Logo"
                        height={63}
                        width={200}
                        priority
                        className="h-auto w-full max-w-[180px] object-contain object-center sm:max-w-[200px]"
                    />
                </LinkComponent>
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
