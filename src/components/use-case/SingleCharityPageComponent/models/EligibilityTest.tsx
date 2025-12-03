import { CheckboxComponent } from '@/components/common/CheckboxComponent';
import DatePicker from '@/components/common/ControlledDatePickerComponent';
import SelectComponent from '@/components/common/SelectComponent';
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Label } from '@/components/ui/label';
import { capitalizeWords } from '@/lib/helpers';
import React, { FC, useState } from 'react'
import { CategoryEnum } from '../../CharitiesPageComponent/kanban/KanbanView';
import { Button } from '@/components/ui/button';

type IProps = {
    charityTite: string;
    charityId: string;
    onSave?: (charityId: string) => void;
    onCancel?: () => void;
}

type FormData = {
    isIslamicCharity: boolean;
    doesItPayZakat: boolean;
    startDate: Date | null;
    category?: keyof typeof CategoryEnum;
}

const INITIAL_FORM_STATE: FormData = {
    isIslamicCharity: false,
    doesItPayZakat: false,
    startDate: null,
}

const EligibilityTest: FC<IProps> = ({ charityTite, charityId, onSave, onCancel }) => {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
    const handleUpdateFormData = (field: keyof FormData, value: FormData[keyof FormData]) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value,
        }));
    }

    const validation = () => {
        if (formData.startDate === null || formData.category === undefined) {
            return false;
        }
        return true;
    }

    return (
        <form className='flex flex-col gap-4'>
            <TypographyComponent className='text-gray-500'>
                Please answer the following questions regarding the {capitalizeWords(charityTite)}:
            </TypographyComponent>
            <CheckboxComponent
                label="Is this an Islamic Charity?"
                checked={formData.isIslamicCharity}
                onCheckedChange={(value) => handleUpdateFormData('isIslamicCharity', Boolean(value))}
            />
            <CheckboxComponent
                label="Does this charity give zakat?"
                checked={formData.doesItPayZakat}
                onCheckedChange={(value) => handleUpdateFormData('doesItPayZakat', Boolean(value))}
            />
            <div className="flex gap-4 items-center">
                <Label htmlFor="eligibility_test__startDate" className="block text-sm font-medium w-1/2">Select Start Date of this charity</Label>
                <DatePicker
                    value={formData.startDate ?? undefined}
                    onChange={(updatedDate) => {
                        handleUpdateFormData('startDate', updatedDate ?? null);
                    }}
                    id="eligibility_test__startDate"
                    label="Date of birth"
                    disabledFutureDates={true}
                />
            </div>
            <div className="flex gap-4 items-center">
                <Label htmlFor="eligibility_test__category" className="block text-sm font-medium w-1/2">Select the category of this charity</Label>
                <SelectComponent
                    id="eligibility_test__category"
                    value={formData.category}
                    onChange={(option) => {
                        handleUpdateFormData('category', option as keyof typeof CategoryEnum)
                    }}
                    options={[
                        { value: 'international-relief', label: 'International Relief' },
                        { value: 'local-relief', label: 'Local Relief' },
                        { value: 'education', label: 'Education' },
                        { value: 'masjid-community-projects', label: 'Masjid & Community Projects' },
                        { value: 'health-medical-aid', label: 'Health & Medical Aid' },
                        { value: 'environment-sustainability', label: 'Environment & Sustainability' },
                        { value: 'advocacy-human-rights', label: 'Advocacy & Human Rights' },
                    ]}
                />
            </div>
            <Button className="w-full" variant={"primary"} disabled={!validation()} onClick={() => {
                if (onSave)
                    onSave(charityId)
            }}>Submit Eligibility Review</Button>
            <Button className="w-full" variant={"outline"} onClick={onCancel}>Cancel</Button>
        </form>
    )
}

export default EligibilityTest
