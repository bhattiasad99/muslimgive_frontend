import React from 'react'
import AssessmentSectionCard from '../../UI/AuditSectionCard'
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
        <AssessmentSectionCard>
            <RadioGroupComponent
                value={value}
                onChange={(newVal) => {
                    onChange(newVal);
                }}
                label={label} labelClassNames='text-sm'
                name={id}

                required={true} options={options} />
        </AssessmentSectionCard>
    )
}

export default SingleRadioQuestion