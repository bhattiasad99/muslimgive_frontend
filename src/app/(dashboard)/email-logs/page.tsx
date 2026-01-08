'use client'
import React, { FC, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import ControlledSearchBarComponent from '@/components/common/SearchBarComponent/ControlledSearchBarComponent'
import { Badge } from '@/components/ui/badge'

type EmailLog = {
  id: string
  subject: string
  charity: string
  time: string
  dateLabel: string
  status: 'Delivered' | 'Failed' | 'Pending' | 'Received'
  body: string
}

const sampleLogs: EmailLog[] = [
  {
    id: 'e0',
    subject: 'Welcome to MuslimGive',
    charity: 'System',
    time: '14:55',
    dateLabel: 'Mon / May 05, 2025',
    status: 'Received',
    body: 'This is a received email example.'
  },
  {
    id: 'e1',
    subject: 'Some Subject',
    charity: 'Some Charity',
    time: '15:00',
    dateLabel: 'Mon / May 05, 2025',
    status: 'Delivered',
    body:
      `Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa.`
  },
  {
    id: 'e2',
    subject: 'Some Subject',
    charity: 'Some Charity',
    time: '15:00',
    dateLabel: 'Mon / May 05, 2025',
    status: 'Failed',
    body: 'Shorter body for failed message example.'
  },
  {
    id: 'e3',
    subject: 'Some Subject',
    charity: 'Some Charity',
    time: '15:00',
    dateLabel: 'Mon / May 05, 2025',
    status: 'Failed',
    body: 'Another failed example body.'
  }
]

const EmailLogsPage: FC = () => {
  const [query, setQuery] = useState('')
  const filtered = sampleLogs.filter(l => l.subject.toLowerCase().includes(query.toLowerCase()) || l.charity.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="p-6">
      <div className="mb-4">
        <ControlledSearchBarComponent query={query} setQuery={(q) => setQuery(q)} placeholder="Search Charity" />
      </div>

      <Accordion type="single" collapsible>
        {filtered.map(log => (
          <AccordionItem key={log.id} value={log.id}>
            <AccordionTrigger asChild className="w-full">
              <div className="flex flex-col gap-2 w-full py-3 px-2 hover:bg-slate-50 cursor-pointer sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-medium sm:min-w-[200px]">Subject: {log.subject}</div>
                <div className="text-sm sm:min-w-[200px]">Charity: {log.charity}</div>
                <div className="text-sm sm:min-w-[80px] sm:text-center">{log.time}</div>
                <div className="text-sm sm:min-w-[180px] sm:text-center">{log.dateLabel}</div>
                <div className="sm:min-w-[90px] flex sm:justify-end">
                  <Badge variant={log.status === 'Delivered' ? 'delivered' : log.status === 'Failed' ? 'destructive' : log.status === 'Received' ? 'received' : 'outline'}>{log.status}</Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-3 px-2">
                <div className="mb-2 font-semibold">Subject: {log.subject}</div>
                <div className="text-sm text-[#333] whitespace-pre-line">{log.body}</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default EmailLogsPage
