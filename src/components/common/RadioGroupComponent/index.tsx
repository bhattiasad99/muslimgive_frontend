import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import React, { FC } from 'react'
import { TypographyComponent } from '../TypographyComponent';

type IProps = {
    label: string;
    required?: boolean;
    options: { label: string; value: string }[];
    defaultSelected?: number;
}

const RadioGroupComponent: FC<IProps> = ({ label = '', required = false, options = [{
    label: 'Option 1', value: 'option1'
}, {
    label: 'Option 2',
    value: 'option2'
}], defaultSelected = 0 }) => {
    return (
        <div className="flex flex-col gap-4">
            {label ? <TypographyComponent><strong>{label}</strong>{required ? <span className='text-red-500'>*</span> : ''}</TypographyComponent> : null}
            <RadioGroup defaultValue={options[defaultSelected]?.value ?? options[0].value} className="flex flex-col gap-3">
                {options.map((eachOption, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <RadioGroupItem value={eachOption.value} id={`radio-${eachOption.value}-${index}`} />
                        <Label htmlFor={`radio-${eachOption.value}-${index}`}>{eachOption.label}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}

export default RadioGroupComponent
