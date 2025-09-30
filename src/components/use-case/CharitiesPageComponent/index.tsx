'use client'
import AddIcon from '@/components/common/IconComponents/AddIcon'
import ControlledSearchBarComponent from '@/components/common/SearchBarComponent/ControlledSearchBarComponent'
import { Button } from '@/components/ui/button'
import React, { useEffect, useMemo, useState } from 'react'
import KanbanTabularToggle, { ViewsType } from '../KanbanTabularToggle'
import EmailIcon from '@/components/common/IconComponents/EmailIcon'
import KanbanView, { SingleCardType } from './kanban/KanbanView'
import TabularView from './tabular/TabularView'
import { DUMMY_CHARITIES } from './DUMMY_CHARITIES'
import Fuse from 'fuse.js'

const CharitiesPageComponent = () => {
    const [queryInput, setQueryInput] = useState('')
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState<ViewsType>('kanban');
    const charities = DUMMY_CHARITIES
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(queryInput)
        }, 800)
        return () => clearTimeout(handler)
    }, [queryInput])

    const fuse = useMemo(() => {
        return new Fuse(DUMMY_CHARITIES, {
            includeScore: false,
            threshold: 0.4,
            ignoreLocation: true,
            minMatchCharLength: 1,
            findAllMatches: true,
            keys: [
                {
                    name: 'charityTitle',
                    getFn: (u: SingleCardType) => `${u.charityTitle}`.trim(),
                },
                // You can add more fields if needed:
                // 'email', 'location', 'postalCode'
                {
                    name: 'charityOwnerName',
                    getFn: (u: SingleCardType) => `${u.charityOwnerName}`.trim(),
                }
            ],
        })
    }, [DUMMY_CHARITIES])

    // Apply fuzzy search
    const searchedRows = useMemo(() => {
        const q = searchQuery.trim()
        if (!q) return charities
        return fuse.search(q).map((r) => r.item)
    }, [searchQuery, fuse, DUMMY_CHARITIES])

    return (
        <div className='flex flex-col gap-5'>
            <div className="flex justify-between items-center gap-5">
                <div className="w-full">
                    <ControlledSearchBarComponent setQuery={(query: string) => {
                        setQueryInput(query)
                    }}
                        query={queryInput}
                        placeholder="Search Charities by Title or Charity Owner's Name"
                    />
                </div>
                <div className="flex gap-4 items-center">
                    <Button size={"icon"} variant={"primary"}>
                        <AddIcon />
                    </Button>
                    <Button variant={"primary"}>
                        <EmailIcon />
                        Send Bulk Email
                    </Button>
                    <KanbanTabularToggle view={view} setView={setView} />
                </div>
            </div>
            <div className="">
                {view === "kanban" ? <KanbanView charities={searchedRows} /> : null}
                {view === "tabular" ? <TabularView /> : null}
            </div>
        </div>
    )
}

export default CharitiesPageComponent