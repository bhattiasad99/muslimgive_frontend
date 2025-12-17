import { CheckboxComponent } from '@/components/common/CheckboxComponent'
import { TypographyComponent } from '@/components/common/TypographyComponent';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link, MessageCircleMore } from 'lucide-react';
import React, { FC, useState } from 'react'

export type LinkAttached = {
    label: string;
    url: string;
}

type Option = {
    value: string;
    label: string;
}

type IProps = {
    options: Option[];
    label: string;
    id: string,
    required?: boolean;
    defaultStatus?: ComplexCheckboxGroupStatus;
    onUpdate: (status: ComplexCheckboxGroupStatus) => void;
}

export type ComplexCheckboxGroupStatus = {
    selectedOptions: string[];
    linksAdded: LinkAttached[];
    commentsAdded: string;
}

const ComplexCheckboxGroup: FC<IProps> = ({
    id,
    options,
    label,
    required = false,
    defaultStatus,
    onUpdate
}) => {
    const [selection, setSelection] = useState<string[]>(defaultStatus?.selectedOptions || []);
    const [linksAdded, setLinksAdded] = useState<LinkAttached[]>(defaultStatus?.linksAdded || []);
    const [commentAdded, setCommentAdded] = useState<string>(defaultStatus?.commentsAdded || '');
    const onUpdateFormInputs = () => {
        onUpdate({
            selectedOptions: selection,
            linksAdded,
            commentsAdded: commentAdded
        })
    }
    return (
        <div className='flex flex-col gap-4'>
            <Label><TypographyComponent className='font-semibold text-sm'>{label}{required && <span className="text-red-400">*</span>}</TypographyComponent></Label>
            <div className="flex flex-col gap-2">
                {options.map(eachOption => <CheckboxComponent className='cursor-pointer' descriptionClassName='cursor-pointer' label={eachOption.label}
                    key={eachOption.value}
                    checked={selection.includes(eachOption.value)} onCheckedChange={(checked) => {
                        if (checked) {
                            setSelection((prev) => [...prev, eachOption.value])
                        } else {
                            setSelection((prev) => prev.filter(item => item !== eachOption.value))
                        }
                        onUpdateFormInputs();
                    }} />)}
            </div>
            <div className="flex gap-4 items-center">
                <Button className='bg-[#F7F7F7] border border-[#e6e6e6]' variant="outline" size={"icon"}>
                    <Link color='#266DD3' />
                </Button>
                <TypographyComponent className='text-xs text-[#666E76] italic'>2 links attached</TypographyComponent>
            </div>
            <div className="flex gap-4 items-center">
                <Button className='bg-[#F7F7F7] border border-[#e6e6e6]' variant="outline" size={"icon"}>
                    <MessageCircleMore color='#266DD3' />
                </Button>
                <TypographyComponent className='text-xs text-[#666E76] italic'>{commentAdded ? 'Note Added' : 'No Note Added'}</TypographyComponent>
            </div>
        </div>
    )
}

export default ComplexCheckboxGroup