import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const AuditHistoryPage = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <TypographyComponent variant='h1'>Audit History</TypographyComponent>
                <TypographyComponent variant='body2' className="text-[#666E76]">
                    Placeholder page for past and in-progress audits. Replace with timeline/table later.
                </TypographyComponent>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CardTitle>Activity feed</CardTitle>
                        <Badge variant="outline">stub</Badge>
                    </div>
                </CardHeader>
                <CardContent className="text-sm text-[#666E76]">
                    Show recent audits, statuses, and links once data is wired up.
                </CardContent>
            </Card>
        </div>
    )
}

export default AuditHistoryPage
