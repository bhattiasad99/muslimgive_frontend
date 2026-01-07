import React from 'react'
import AuditSectionCard from '../../UI/AuditSectionCard'
import RadioGroupComponent from '@/components/common/RadioGroupComponent'

type IProps = {
    label: string;
    id: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (newVal: string) => void;
}

const SingleRadioQuestion = ({ label, id, options, value, onChange }: IProps) => {
    return (
        <AuditSectionCard>
            <RadioGroupComponent
                value={value}
                onChange={(newVal) => {
                    onChange(newVal);
                }}
                label={label} labelClassNames='text-sm'
                name={id}

                required={true} options={options} />
        </AuditSectionCard>
    )
}

export default SingleRadioQuestion