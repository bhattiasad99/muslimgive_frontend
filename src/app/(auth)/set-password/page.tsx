import { verifyToken } from '@/auth/actions'
import SetPasswordComponent from '@/components/use-case/SetPasswordComponent'
import LinkComponent from '@/components/common/LinkComponent'

type SetPasswordPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const SetPassword = async ({ searchParams }: SetPasswordPageProps) => {
    const resolvedSearchParams = await searchParams
    const rawToken = resolvedSearchParams.token

    if (typeof rawToken !== "string" || rawToken.trim() === "") {
        return <div>No token provided. Please use the link from your email.</div>
    }

    const { ok, message } = await verifyToken(rawToken)

    if (!ok) {
        return (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
                <p className="text-red-600 font-medium">
                    {message ?? "This link is invalid or has already been used."}
                </p>
                <p className="text-sm text-muted-foreground">
                    If you need access, request a new link.
                </p>
                <LinkComponent to="forgot-password" className="underline text-sm">
                    Request a new link
                </LinkComponent>
            </div>
        )
    }

    return <SetPasswordComponent token={rawToken} />
}

export default SetPassword
