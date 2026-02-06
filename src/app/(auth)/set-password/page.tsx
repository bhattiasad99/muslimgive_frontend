import { verifyToken } from '@/auth/actions'
import SetPasswordComponent from '@/components/use-case/SetPasswordComponent'

type SetPasswordPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const SetPassword = async ({ searchParams }: SetPasswordPageProps) => {
    const resolvedSearchParams = await searchParams
    const rawToken = resolvedSearchParams.token

    if (typeof rawToken !== "string") {
        return <div>Invalid token</div>
    }

    const { ok } = await verifyToken(rawToken)

    if (!ok) {
        return <div>Invalid or expired token</div>
    }

    return <SetPasswordComponent token={rawToken} />
}

export default SetPassword
