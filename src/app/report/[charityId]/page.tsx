import { redirect } from 'next/navigation'

const ReportRedirectPage = async ({ params }: { params: Promise<{ charityId: string }> }) => {
    const { charityId } = await params
    redirect(`/reports/${charityId}`)
}

export default ReportRedirectPage
