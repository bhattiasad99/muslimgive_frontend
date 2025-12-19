import React, { useState } from 'react'
import SingleSectionQuestion from '../../SingleSectionQuestion'
import { Link } from 'lucide-react'
import AuditSectionCard from '../../UI/AuditSectionCard'
import RadioGroupComponent from '@/components/common/RadioGroupComponent'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import DatePicker from '@/components/common/ControlledDatePickerComponent'
import { Label } from '@/components/ui/label'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type FormDataType = {
    financialsLink?: string;
    taxReturnLink?: string;
    irsReturnsLink?: string;
    craReturnsLink?: string;
    endOfFiscalYear: Date | null;
    charitableRegistrationSince: Date | null;
    analysisDate?: Date | null;
    auditedStatementsAvailable: string;
    pyAuditedStatementsAvailable: string;
    impactReportAvailable: string;
    notes: string;
}

const INITIAL_FORM_DATA: FormDataType = {
    financialsLink: '',
    taxReturnLink: '',
    irsReturnsLink: '',
    craReturnsLink: '',
    endOfFiscalYear: null,
    charitableRegistrationSince: null,
    analysisDate: null,
    auditedStatementsAvailable: '',
    pyAuditedStatementsAvailable: '',
    impactReportAvailable: '',
    notes: '',
}

type IProps = {
    location: 'ca' | 'uk' | 'usa';
    charityId: string;
}

const CoreArea2: React.FC<IProps> = ({ location, charityId }) => {
    const [formData, setFormData] = useState<FormDataType>(INITIAL_FORM_DATA)

    const updateFormData = (field: keyof FormDataType, value: FormDataType[keyof FormDataType]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const router = useRouter();

    return (
        <>
            {/* Financials Link - UK and US only */}
            {(location === 'uk' || location === 'usa') && (
                <AuditSectionCard>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="core_2__financials-link" className="block text-sm font-semibold">
                            Financials (Link)<span className="text-red-500">*</span>
                        </Label>
                        <ControlledTextFieldComponent
                            id="core_2__financials-link"
                            value={formData.financialsLink || ''}
                            onChange={(e) => updateFormData('financialsLink', e.target.value)}
                            icon={{
                                component: <Link size={14} color="#266dd3" />,
                                direction: 'left'
                            }}
                        />
                    </div>
                </AuditSectionCard>
            )}

            {/* Tax Return Link - UK only */}
            {location === 'uk' && (
                <AuditSectionCard>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="core_2__tax-return-link" className="block text-sm font-semibold">
                            Tax Return (Link)<span className="text-red-500">*</span>
                        </Label>
                        <ControlledTextFieldComponent
                            id="core_2__tax-return-link"
                            value={formData.taxReturnLink || ''}
                            onChange={(e) => updateFormData('taxReturnLink', e.target.value)}
                            icon={{
                                component: <Link size={14} color="#266dd3" />,
                                direction: 'left'
                            }}
                        />
                    </div>
                </AuditSectionCard>
            )}

            {/* IRS Returns Link - US only */}
            {location === 'usa' && (
                <AuditSectionCard>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="core_2__irs-returns-link" className="block text-sm font-semibold">
                            IRS Returns (Link)<span className="text-red-500">*</span>
                        </Label>
                        <ControlledTextFieldComponent
                            id="core_2__irs-returns-link"
                            value={formData.irsReturnsLink || ''}
                            onChange={(e) => updateFormData('irsReturnsLink', e.target.value)}
                            icon={{
                                component: <Link size={14} color="#266dd3" />,
                                direction: 'left'
                            }}
                        />
                    </div>
                </AuditSectionCard>
            )}

            {/* CRA's Returns Link - Canada only */}
            {location === 'ca' && (
                <AuditSectionCard>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="core_2__cra-returns-link" className="block text-sm font-semibold">
                            CRA's Returns (Link)<span className="text-red-500">*</span>
                        </Label>
                        <ControlledTextFieldComponent
                            id="core_2__cra-returns-link"
                            value={formData.craReturnsLink || ''}
                            onChange={(e) => updateFormData('craReturnsLink', e.target.value)}
                            icon={{
                                component: <Link size={14} color="#266dd3" />,
                                direction: 'left'
                            }}
                        />
                    </div>
                </AuditSectionCard>
            )}

            {/* Date Pickers Section */}
            <AuditSectionCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <TypographyComponent className='font-semibold text-sm'>
                            End of fiscal year<span className="text-red-500">*</span>
                        </TypographyComponent>
                        <div className="w-[306px]">
                            <DatePicker
                                label='End of fiscal year'
                                onChange={(date) => updateFormData('endOfFiscalYear', date ?? null)}
                                value={formData.endOfFiscalYear ?? undefined}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <TypographyComponent className='font-semibold text-sm'>
                            Charitable Registration since
                        </TypographyComponent>
                        <div className="w-[306px]">
                            <DatePicker
                                disabledFutureDates
                                label='Charitable Registration since'
                                onChange={(date) => updateFormData('charitableRegistrationSince', date ?? null)}
                                value={formData.charitableRegistrationSince ?? undefined}
                            />
                        </div>
                    </div>

                    {/* Analysis Date - US and Canada only */}
                    {(location === 'usa' || location === 'ca') && (
                        <div className="flex flex-col gap-2">
                            <TypographyComponent className='font-semibold text-sm'>
                                {location === 'usa' ? 'Analysis Reviewed Date' : "SNK Team's Analysis Date"}
                            </TypographyComponent>
                            <div className="w-[306px]">
                                <DatePicker
                                    label={location === 'usa' ? 'Analysis Reviewed Date' : "SNK Team's Analysis Date"}
                                    onChange={(date) => updateFormData('analysisDate', date ?? null)}
                                    value={formData.analysisDate ?? undefined}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </AuditSectionCard>

            {/* Audited Financial Statements Available */}
            <AuditSectionCard>
                <RadioGroupComponent
                    value={formData.auditedStatementsAvailable}
                    onChange={(newVal) => updateFormData('auditedStatementsAvailable', newVal)}
                    label="Audited Financial Statements Available on Website?"
                    labelClassNames='text-sm'
                    name="core_2__audited-statements-available"
                    required={true}
                    options={[
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' }
                    ]}
                />
            </AuditSectionCard>

            {/* P.Y Audited Financial Statements Available */}
            <AuditSectionCard>
                <RadioGroupComponent
                    value={formData.pyAuditedStatementsAvailable}
                    onChange={(newVal) => updateFormData('pyAuditedStatementsAvailable', newVal)}
                    label="P.Y Audited Financial Statements Available on Website?"
                    labelClassNames='text-sm'
                    name="core_2__py-audited-statements-available"
                    required={true}
                    options={[
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' }
                    ]}
                />
            </AuditSectionCard>

            {/* Impact Report Available */}
            <AuditSectionCard>
                <RadioGroupComponent
                    value={formData.impactReportAvailable}
                    onChange={(newVal) => updateFormData('impactReportAvailable', newVal)}
                    label="Impact Report Available with Financial info on website?"
                    labelClassNames='text-sm'
                    name="core_2__impact-report-available"
                    required={true}
                    options={[
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' }
                    ]}
                />
            </AuditSectionCard>

            {/* Notes Section */}
            <SingleSectionQuestion
                type="textarea"
                heading='Notes'
                lines={6}
                id='core_2__notes'
                required={false}
                className='h-[127px] resize-none'
            />

            {/* Action Buttons */}
            <div className='flex gap-4 mb-8'>
                <Button className="w-36" variant='primary' onClick={() => {
                    router.push(`/charities/${charityId}/audits/core-area-2?preview-mode=true`)
                }}>Preview</Button>
                <Button className="w-36" variant={'outline'}>Cancel</Button>
            </div>
        </>
    )
}

export default CoreArea2