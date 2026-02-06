"use client"

import React, { FC } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Mail, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import type { SingleCharityType } from '../kanban/KanbanView'
import Can from '@/components/common/Can'
import { PERMISSIONS } from '@/lib/permissions-config'

type Props = {
    charities: SingleCharityType[]
}

const statusMeta: Record<string, { title: string; color: string }> = {
    'pending-eligibility': { title: 'Pending Eligibility Review', color: '#F25F5C' },
    'unassigned': { title: 'Unassigned', color: '#F25CD4' },
    'open-to-review': { title: 'Open To Review', color: '#5CD9F2' },
    'pending-admin-review': { title: 'Pending Review by Admin', color: '#266DD3' },
    'approved': { title: 'Approved', color: '#5CF269' },
    'ineligible': { title: 'Ineligible', color: '#112133' },
}

function parseMonths(totalDuration?: string) {
    if (!totalDuration) return undefined
    const s = totalDuration.toLowerCase()
    const numMatch = s.match(/(\d+(?:\.\d+)?)/)
    if (!numMatch) return undefined
    const num = Number(numMatch[1])
    if (s.includes('year')) return num * 12
    return num // assume months
}

const TabularView: FC<Props> = ({ charities }) => {
    const [page, setPage] = React.useState(1)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)

    const total = charities.length
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))

    React.useEffect(() => {
        if (page > totalPages) setPage(totalPages)
    }, [totalPages, page])

    const start = (page - 1) * rowsPerPage
    const end = Math.min(start + rowsPerPage, total)

    const pageItems = charities.slice(start, end)

    return (
        <div className="bg-white rounded-lg border p-2">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Charity Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead className="w-[180px]">Team</TableHead>
                        <TableHead className="text-center">Audits Completed</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead className="text-center">Within 2 years</TableHead>
                        <TableHead>Pending Reason</TableHead>
                        <TableHead className="w-[140px] text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pageItems.map((c, idx) => {
                        const globalIdx = start + idx
                        const status = statusMeta[c.status] || { title: c.status, color: '#999' }
                        const percent = Math.round((Number(c.auditsCompleted || 0) / 4) * 100)
                        const months = parseMonths(c.totalDuration)
                        const withinTwoYears = typeof months === 'number' ? months <= 24 : undefined
                        const pendingSource = (c.pendingEligibilitySource || '').toLowerCase().replace(/_/g, '-')
                        const isDeepScan = c.status === 'pending-eligibility' && pendingSource.includes('deep')

                        return (
                            <TableRow key={`${c.id}-${globalIdx}`}>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="font-medium">{c.charityTitle}</div>
                                    </div>
                                </TableCell>

                                <TableCell className="py-4">
                                    <Badge style={{ backgroundColor: status.color, color: '#fff' }} className="px-3 py-1">{status.title}</Badge>
                                </TableCell>

                                <TableCell className="py-4">{c.charityOwnerName}</TableCell>

                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {c.members.slice(0, 3).map((m) => (
                                                <Avatar key={m.id} className="w-8 h-8 border-2 border-white">
                                                    {m.profilePicture ? (
                                                        <AvatarImage src={m.profilePicture} alt={m.name} />
                                                    ) : (
                                                        <AvatarFallback>{m.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</AvatarFallback>
                                                    )}
                                                </Avatar>
                                            ))}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{c.members.length}</div>
                                    </div>
                                </TableCell>

                                <TableCell className="py-4 text-center">{`${c.auditsCompleted}/4`}</TableCell>

                                <TableCell className="py-4">
                                    <div className="w-40">
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${percent}%` }} />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">{percent}%</div>
                                    </div>
                                </TableCell>

                                <TableCell className="py-4 text-center">
                                    {withinTwoYears === undefined ? (
                                        <span className="text-muted-foreground">-</span>
                                    ) : withinTwoYears ? (
                                        <span className="text-green-500">✓</span>
                                    ) : (
                                        <span className="text-red-500">✕</span>
                                    )}
                                </TableCell>

                                <TableCell className="py-4">
                                    {c.status === 'pending-eligibility' ? (
                                        <div className="flex flex-col gap-1">
                                            {isDeepScan ? (
                                                <Badge variant="secondary" className="w-fit bg-amber-100 text-amber-900">Deep scan</Badge>
                                            ) : null}
                                            <span className="text-xs text-muted-foreground">
                                                {c.pendingEligibilityReason || (isDeepScan ? 'Eligibility rules updated.' : '-')}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>

                                <TableCell className="py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <Can anyOf={[PERMISSIONS.SEND_EMAIL_CHARITY_OWNER]}>
                                            <Button variant="ghost" size="icon" onClick={() => console.log('mail', c.id)}>
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                        </Can>
                                        <Link href={`/charities/${c.id}`} className="inline-block">
                                            <Button variant="ghost" size="icon">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            <div className="flex flex-wrap items-center justify-end gap-3 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <Select value={String(rowsPerPage)} onValueChange={(v) => { setRowsPerPage(Number(v)); setPage(1) }}>
                        <SelectTrigger size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-muted-foreground">{`${start + 1}-${end} of ${total}`}</div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TabularView
