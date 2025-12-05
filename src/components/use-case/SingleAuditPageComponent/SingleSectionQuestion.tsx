'use client'
import React, { FC } from 'react'
import AuditSectionCard from './UI/AuditSectionCard'
import { SingleQuestionProps } from './types'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { TextFieldComponent } from '@/components/common/TextFieldComponent'

type IProps = SingleQuestionProps & {
    onInputChange?: (name: string, value: string) => void
}

const SingleSectionQuestion: FC<IProps> = (p) => {
    const { heading, type, onInputChange, id, required } = p

    return (
        <AuditSectionCard>
            <div className="flex flex-col gap-2">
                <TypographyComponent>
                    <strong>
                        {heading}{required ? <span className="text-red-500">*</span> : ''}
                    </strong>
                </TypographyComponent>
                {type === 'text' ? (
                    <TextFieldComponent
                        {...p.inputProps}
                        label=""
                        id={id}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (onInputChange) onInputChange(id, e.target.value)
                        }}
                    />
                ) : null}
            </div>
        </AuditSectionCard>
    )
}

export default SingleSectionQuestion
