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

import { performEligibilityTestAction } from '@/app/actions/charities';
import { toast } from 'sonner';

const EligibilityTest: FC<IProps> = ({ charityTite, charityId, onSave, onCancel }) => {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async () => {
        if (!validation()) return;
        setIsLoading(true);
        try {
            const payload = {
                startDate: formData.startDate ? formData.startDate.toISOString().split('T')[0] : "",
                doesCharityGiveZakat: formData.doesItPayZakat,
                isIslamic: formData.isIslamicCharity,
                category: formData.category!,
            };

            const res = await performEligibilityTestAction(charityId, payload);

            // The backend returns a nested data object: res.payload.data.data
            const updatedData = res.payload?.data?.data;
            const newStatus = updatedData?.status;

            if (res.ok) {
                if (newStatus === 'ineligible') {
                    toast.error("Charity marked as Ineligible based on the provided details.");
                } else {
                    toast.success(res.payload?.data?.message || "Eligibility test performed successfully");
                }

                if (onSave) onSave(charityId);
            } else {
                toast.error(res.message || "Failed to submit eligibility test");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <form className='flex flex-col gap-4' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Label htmlFor="eligibility_test__startDate" className="block text-sm font-medium w-full sm:w-1/2">Select Start Date of this charity</Label>
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Label htmlFor="eligibility_test__category" className="block text-sm font-medium w-full sm:w-1/2">Select the category of this charity</Label>
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
            <Button
                className="w-full"
                variant={"primary"}
                type="submit"
                disabled={!validation()}
                loading={isLoading}
            >
                Submit Eligibility Review
            </Button>
            <Button className="w-full" variant={"outline"} type="button" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        </form>
    )
}


export default EligibilityTest
