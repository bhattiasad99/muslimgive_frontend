'use client'
import { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import KanbanViewIcon from '@/components/common/IconComponents/KanbanViewIcon'
import TabularViewIcon from '@/components/common/IconComponents/TabularViewIcon'

export type ViewsType = 'kanban' | 'tabular'

type IProps = {
    view: ViewsType,
    setView: (e: ViewsType) => void;
}

const KanbanTabularToggle: FC<IProps> = ({ setView, view }) => {

    const isKanban = view === 'kanban'
    const isTabular = view === 'tabular'

    return (
        <div className="inline-flex w-fit -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
            <Button
                type="button"
                onClick={() => setView('kanban')}
                variant={isKanban ? 'primary' : 'outline'}
                className={[
                    'group relative justify-start gap-2 overflow-hidden rounded-none rounded-l-md shadow-none transition-all duration-200',
                    'w-10 hover:w-24 focus:w-24', // button expands on hover/focus
                    isKanban ? 'text-white' : 'text-[#112133]',
                    'hover:bg-sky-500/10 hover:text-sky-500',
                    'focus-visible:z-10 dark:hover:bg-sky-400/10 dark:hover:text-sky-400',
                ].join(' ')}
                aria-pressed={isKanban}
            >
                <KanbanViewIcon className="shrink-0" />
                {/* hidden by default, fades in on hover/focus */}
                <span className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity whitespace-nowrap">
                    Kanban
                </span>
            </Button>

            <Button
                type="button"
                onClick={() => setView('tabular')}
                variant={isTabular ? 'primary' : 'outline'}
                className={[
                    'group relative justify-end gap-2 overflow-hidden rounded-none rounded-r-md shadow-none transition-all duration-200',
                    'w-10 hover:w-28 focus:w-28',
                    isTabular ? 'text-white' : 'text-[#112133]',
                    'hover:bg-destructive/10 hover:text-destructive',
                    'focus-visible:z-10',
                ].join(' ')}
                aria-pressed={isTabular}
            >
                <span className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity whitespace-nowrap">
                    Tabular
                </span>
                <TabularViewIcon className="shrink-0" />
            </Button>
        </div>
    )
}

export default KanbanTabularToggle
