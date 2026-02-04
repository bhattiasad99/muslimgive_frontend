import { verifyToken } from '@/auth/actions'
import SetPasswordComponent from '@/components/use-case/SetPasswordComponent'

type SetPasswordPageProps = {
    searchParams: { [key: string]: string | string[] | undefined }
}

const SetPassword = async ({ searchParams }: SetPasswordPageProps) => {
    const rawToken = searchParams.token

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
