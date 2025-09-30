'use client'

import CardComponent from '@/components/common/CardComponent'
import UsersExpandableTable, { Data } from '@/components/use-case/UsersExpandableTable'
import AddUserIcon from '@/components/common/IconComponents/AddUserIcon'
import FilterIcon from '@/components/common/IconComponents/FilterIcon'
import SearchIcon from '@/components/common/IconComponents/SearchIcon'
import { TextFieldComponent } from '@/components/common/TextFieldComponent'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Button } from '@/components/ui/button'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import Fuse from 'fuse.js'
import ControlledSearchBarComponent from '@/components/common/SearchBarComponent/ControlledSearchBarComponent'

type PaginationType = {
    show: 10 | 20 | 30
    totalEntries: number
    pageNumber: number
}

const ROLE_KEYS = [
    'Financial Auditor',
    'Zakat Auditor',
    'Project Manager',
    'MG Admin',
    'Operations Manager',
] as const

const STATUS_KEYS = ['Active', 'Inactive'] as const
const RESET_KEY = 'Reset Password' as const

type FilterKey =
    | (typeof ROLE_KEYS)[number]
    | (typeof STATUS_KEYS)[number]
    | typeof RESET_KEY

// Start permissive: everything visible; reset-requests off by default.
const STARTING_FILTER_OPTIONS: Record<FilterKey, boolean> = {
    'Financial Auditor': true,
    'Zakat Auditor': true,
    'Project Manager': true,
    'MG Admin': true,
    'Operations Manager': true,
    Active: true,
    Inactive: true,
    'Reset Password': false,
}

type IProps = {
    usersArr: Data[]
}

const UsersPageComponent: FC<IProps> = ({ usersArr }) => {
    // pagination
    const [opt, setOpt] = useState<PaginationType>({
        show: 10,
        totalEntries: usersArr.length,
        pageNumber: 1,
    })

    // filter state
    const [openFilterPopover, setOpenFilterPopover] = useState(false)
    const [filterOpts, setFilterOpts] = useState<Record<FilterKey, boolean>>(
        STARTING_FILTER_OPTIONS
    )

    // search state (debounced)
    const [queryInput, setQueryInput] = useState('')
    const [query, setQuery] = useState('')

    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(queryInput)
            setOpt((prev) => ({ ...prev, pageNumber: 1 }))
        }, 300)
        return () => clearTimeout(handler)
    }, [queryInput])

    // Rebuild Fuse when usersArr changes
    const fuse = useMemo(() => {
        return new Fuse(usersArr, {
            includeScore: false,
            threshold: 0.4,
            ignoreLocation: true,
            minMatchCharLength: 1,
            findAllMatches: true,
            keys: [
                {
                    name: 'name',
                    getFn: (u: Data) => `${u.firstName} ${u.lastName}`.trim(),
                },
                // You can add more fields if needed:
                // 'email', 'location', 'postalCode'
            ],
        })
    }, [usersArr])

    // Apply fuzzy search
    const searchedRows = useMemo(() => {
        const q = query.trim()
        if (!q) return usersArr
        return fuse.search(q).map((r) => r.item)
    }, [query, fuse, usersArr])

    // Then apply toggle filters (only when not "all on")
    const filteredRows = useMemo(() => {
        const activeRoleFilters = ROLE_KEYS.filter((k) => filterOpts[k])
        const allRolesOn = activeRoleFilters.length === ROLE_KEYS.length

        const activeStatusFilters = STATUS_KEYS.filter((k) => filterOpts[k])
        const allStatusesOn = activeStatusFilters.length === STATUS_KEYS.length

        const resetOn = filterOpts[RESET_KEY]

        return searchedRows.filter((u) => {
            const rolesOk = allRolesOn
                ? true
                : u.roles.some((r) => activeRoleFilters.includes(r as (typeof ROLE_KEYS)[number]))

            const statusOk = allStatusesOn ? true : activeStatusFilters.includes(u.status as (typeof STATUS_KEYS)[number])

            const resetOk = resetOn ? u.requestingPasswordReset === true : true

            return rolesOk && statusOk && resetOk
        })
    }, [searchedRows, filterOpts])

    // keep totalEntries + page clamp in sync with results
    useEffect(() => {
        const total = filteredRows.length
        const totalPages = Math.max(1, Math.ceil(total / opt.show))
        setOpt((prev) => ({
            ...prev,
            totalEntries: total,
            pageNumber: Math.min(prev.pageNumber, totalPages),
        }))
    }, [filteredRows, opt.show])

    const totalPages = Math.max(1, Math.ceil(opt.totalEntries / opt.show))
    const startIndex = (opt.pageNumber - 1) * opt.show
    const endIndex = Math.min(opt.pageNumber * opt.show, opt.totalEntries)

    const pageRows = useMemo(
        () => filteredRows.slice(startIndex, endIndex),
        [filteredRows, startIndex, endIndex]
    )
    const goPrev = () =>
        setOpt((s) => ({ ...s, pageNumber: Math.max(1, s.pageNumber - 1) }))

    const goNext = () =>
        setOpt((s) => ({ ...s, pageNumber: Math.min(totalPages, s.pageNumber + 1) }))

    const onChangeShow = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newShow = Number(e.target.value) as 10 | 20 | 30
        const newTotalPages = Math.max(1, Math.ceil(opt.totalEntries / newShow))
        setOpt((prev) => ({
            ...prev,
            show: newShow,
            pageNumber: Math.min(prev.pageNumber, newTotalPages),
        }))
    }

    const toggleFilter = (key: FilterKey) =>
        setFilterOpts((prev) => ({ ...prev, [key]: !prev[key] }))

    const switchId = (label: string) =>
        `filter_switch__${label.toLowerCase().replace(/\s+/g, '_')}`

    return (
        <CardComponent>
            <div className="flex items-center">
                <TypographyComponent variant="h2" className="w-full">
                    Manage Users
                </TypographyComponent>
                <Button variant="primary">
                    <span>
                        <AddUserIcon />
                    </span>
                    Add new MG Member
                </Button>
            </div>

            <div className="flex gap-4 py-4">
                <Popover open={openFilterPopover} onOpenChange={setOpenFilterPopover}>
                    <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button size="icon" variant="secondary">
                            <FilterIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        className="w-fit p-2"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-3 p-2 w-[320px]">
                            <span className="text-[10px] text-[#666E76]">Roles</span>

                            {ROLE_KEYS.map((role) => {
                                const id = switchId(role)
                                return (
                                    <div key={role} className="flex items-center w-full">
                                        <label htmlFor={id} className="w-full">
                                            {role}
                                        </label>
                                        <Switch
                                            id={id}
                                            checked={!!filterOpts[role]}
                                            onCheckedChange={() => toggleFilter(role)}
                                        />
                                    </div>
                                )
                            })}

                            <span className="text-[10px] text-[#666E76]">Requests</span>
                            {(() => {
                                const id = switchId(RESET_KEY)
                                return (
                                    <div className="flex items-center w-full">
                                        <label htmlFor={id} className="w-full">
                                            {RESET_KEY}
                                        </label>
                                        <Switch
                                            id={id}
                                            checked={!!filterOpts[RESET_KEY]}
                                            onCheckedChange={() => toggleFilter(RESET_KEY)}
                                        />
                                    </div>
                                )
                            })()}

                            <span className="text-[10px] text-[#666E76]">Status</span>
                            {STATUS_KEYS.map((status) => {
                                const id = switchId(status)
                                return (
                                    <div key={status} className="flex items-center w-full">
                                        <label htmlFor={id} className="w-full">
                                            {status}
                                        </label>
                                        <Switch
                                            id={id}
                                            checked={!!filterOpts[status]}
                                            onCheckedChange={() => toggleFilter(status)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </PopoverContent>
                </Popover>
                <ControlledSearchBarComponent setQuery={(query: string) => {
                    setQueryInput(query)
                }}
                    query={queryInput}
                    placeholder='Search Users by Name'
                />

            </div>

            <div className="flex flex-col gap-2">
                <UsersExpandableTable rows={pageRows.filter(eachRow => eachRow.firstName !== "")} />
                <div className="w-full flex justify-end items-center text-xs gap-2">
                    <span>Rows per page:</span>
                    <select
                        name="pagination-setting"
                        value={opt.show}
                        onChange={onChangeShow}
                        className="border rounded px-1 py-0.5"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                    </select>

                    <span>
                        {opt.totalEntries === 0 ? '0-0' : `${startIndex + 1}-${endIndex}`} of{' '}
                        {opt.totalEntries}
                    </span>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={goPrev}
                        disabled={opt.pageNumber <= 1}
                        aria-label="Previous page"
                    >
                        <ChevronLeft />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={goNext}
                        disabled={opt.pageNumber >= totalPages}
                        aria-label="Next page"
                    >
                        <ChevronRight />
                    </Button>

                    <span className="ml-2">
                        Page {opt.pageNumber} of {totalPages}
                    </span>
                </div>
            </div>
        </CardComponent>
    )
}

export default UsersPageComponent
