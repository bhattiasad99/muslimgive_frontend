
import { Card } from '@/components/ui/card'
import React, { FC } from 'react'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { KanbanColType, SingleCharityType } from './KanbanView'
import SingleCharityCard from './SingleCharityCard'

type IProps = Omit<KanbanColType, 'id'> & {
    cards: SingleCharityType[]
}

const KanbanColumn: FC<IProps> = ({ color, title, cards }) => {
    return (
        <Card className='min-w-[328px] border border-[rgba(0,0,0,0.1)] bg-accent p-6 rounded-2xl flex flex-col gap-6 h-135'>
            <div className="flex gap-2 items-center">
                <div style={{ backgroundColor: color }}
                    className="w-2 h-2 rounded-full">&nbsp;</div>
                <TypographyComponent variant='h5'>{title}</TypographyComponent>
            </div>
            <div className="max-h-full overflow-y-auto scrollbar-sleek pr-1">
                <div className="flex flex-col gap-6">
                    {cards.map(eachCard => <SingleCharityCard key={eachCard.id}
                        auditsCompleted={eachCard.auditsCompleted}
                        charityDesc={eachCard.charityDesc}
                        charityOwnerName={eachCard.charityOwnerName}
                        charityTitle={eachCard.charityTitle}
                        comments={eachCard.comments}
                        id={eachCard.id}
                        members={eachCard.members}
                        status={eachCard.status}
                    />)}
                </div>
            </div>
        </Card>
    )
}

export default KanbanColumn