import React, { useState } from 'react'
import SingleSectionQuestion from '../../SingleSectionQuestion'
import { Link } from 'lucide-react'
import AuditSectionCard from '../../UI/AuditSectionCard'
import RadioGroupComponent from '@/components/common/RadioGroupComponent'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import DatePicker from '@/components/common/ControlledDatePickerComponent'
import { Label } from '@/components/ui/label'
import SelectComponent from '@/components/common/SelectComponent'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import ControlledFileUploadComponent, { UploadedItem } from '@/components/common/FileUploadComponent/ControlledFileUploadComponent'
import { Button } from '@/components/ui/button'
import { isValidUrl } from '@/lib/helpers'

type FileStatusEvidence = {
    type: 'file';
    fileInfo: UploadedItem | null;
}

type LinkStatusEvidence = {
    type: 'link';
    linkUrl: string;
}

type FormDataType = {
    charityNumber: number;
    charityCommissionProfileLink: string;
    registrationStatus: 'registered' | 'not_registered' | 'pending';
    eligibleForGiftAid: boolean;
    registrationDate: Date | null;
    statusEvidence: FileStatusEvidence | LinkStatusEvidence | null;
    giftStatusEvidenceUrl: string;
    statusNotes: string;
}

const INITIAL_FORM_DATA: FormDataType = {
    charityNumber: 0,
    charityCommissionProfileLink: '',
    registrationStatus: 'not_registered',
    eligibleForGiftAid: false,
    registrationDate: null,
    statusEvidence: null,
    giftStatusEvidenceUrl: '',
    statusNotes: '',
}

const CoreArea1 = () => {
    const [formData, setFormData] = useState<FormDataType>(INITIAL_FORM_DATA)
    const updateFormData = (field: keyof FormDataType, value: FormDataType[keyof FormDataType]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleUpload = async (incoming: File[]) => {
        // send to backend or storage, then set state with returned ids
        const mapped = incoming.map((f) => ({
            id: crypto.randomUUID(),
            name: f.name,
            size: f.size,
            type: f.type,
            file: f,
        }));

        updateFormData('statusEvidence', {
            type: 'file',
            fileInfo: mapped[0] // assuming single file upload for status evidence
        })
    };

    const [linkBlurred, setLinkBlurred] = useState<boolean>(false);
    return (
        <>
            <SingleSectionQuestion heading='Enter Charity Number' type='text' id='core_1__charity-number' required={true} inputProps={{
                type: 'number',
            }} />
            <SingleSectionQuestion heading='Enter Charity Commission Profile Link' type='text' id='core_1__charity-commission-profile-link' required={true} inputProps={{
                type: 'text',
                icon: {
                    component: <Link size={14} color="#266dd3" />,
                    direction: 'left'
                }
            }} />
            <AuditSectionCard>
                <div className="flex flex-col gap-4">
                    <RadioGroupComponent
                        value={formData.registrationStatus}
                        onChange={(newVal) => {
                            updateFormData('registrationStatus', newVal)
                        }}
                        label="Registration Status"
                        labelClassNames='text-sm'
                        name="core_1__registration-status"

                        required={true} options={[
                            { label: 'Registered', value: 'registered' },
                            { label: 'Not Registered', value: 'not_registered' },
                            { label: 'Pending', value: 'pending' }
                        ]} />
                    {formData.registrationStatus === 'registered' || formData.registrationStatus === 'pending' ? <>
                        <div className="flex flex-col gap-2">
                            <TypographyComponent className='font-semibold text-sm'>

                                Select Registration Date of this charity

                            </TypographyComponent>
                            <DatePicker disabledFutureDates label='Select Registration Date of this charity' onChange={(date) => {
                                updateFormData('registrationDate', date ?? null)
                            }} value={formData.registrationDate ?? undefined} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="core_1__status-evidence" className="block text-sm font-semibold w-1/2">Upload Status Evidence</Label>
                            <SelectComponent
                                id="core_1__status-evidence"
                                value={formData.statusEvidence?.type}
                                onChange={(option) => {
                                    if (option === 'file') {
                                        updateFormData('statusEvidence', {
                                            type: 'file',
                                            fileInfo: null
                                        })
                                    } else if (option === 'link') {
                                        updateFormData('statusEvidence', {
                                            type: 'link',
                                            linkUrl: ''
                                        })
                                    } else {
                                        updateFormData('statusEvidence', null)
                                    }
                                }}
                                options={[
                                    { label: 'Upload File', value: 'file' },
                                    { label: 'Provide Link', value: 'link' },
                                ]}
                            />
                        </div>
                        {formData.statusEvidence?.type === 'link' ? <>
                            <ControlledTextFieldComponent
                                value={formData.statusEvidence.linkUrl}
                                onChange={(e) => {
                                    setLinkBlurred(false);
                                    if (formData.statusEvidence?.type === 'link') {
                                        updateFormData('statusEvidence', {
                                            ...formData.statusEvidence,
                                            linkUrl: e.target.value
                                        })
                                    }
                                }}
                                onBlur={() => setLinkBlurred(true)}
                                icon={{
                                    component: <Link size={14} color="#266dd3" />,
                                    direction: 'left'
                                }}
                            />
                            {linkBlurred && !isValidUrl(formData.statusEvidence.linkUrl, false) ? <p className='text-red-400 text-xs'>The URL provided is not valid.</p> : null}
                        </> : null}
                        {formData.statusEvidence?.type === 'file' ? <>
                            <ControlledFileUploadComponent
                                required={true}
                                value={formData.statusEvidence.fileInfo ? [formData.statusEvidence.fileInfo] : []}
                                onFileUpload={handleUpload}
                                onRemove={() => updateFormData('statusEvidence', {
                                    type: 'file',
                                    fileInfo: null
                                })}
                                limit={1}
                                disabled={formData.statusEvidence.fileInfo !== null}
                            />
                        </> : null}
                    </> : null}
                </div>
            </AuditSectionCard>
            <AuditSectionCard>
                <RadioGroupComponent
                    value={formData.eligibleForGiftAid.toString()}
                    onChange={(newVal) => {
                        updateFormData('eligibleForGiftAid', newVal === 'true')
                    }}
                    label="Is this charity eligible for Gift aid?" labelClassNames='text-sm'
                    name="core_1__eligible-gift-aid"

                    required={true} options={[
                        { label: 'Yes', value: 'true' },
                        { label: 'No', value: 'false' }
                    ]} />
            </AuditSectionCard>
            <AuditSectionCard>
                <Label htmlFor="core_1__gift-status-evidence-url" className="block text-sm font-semibold w-1/2">Link to Gift Aid status </Label>
                <ControlledTextFieldComponent
                    id="core_1__gift-status-evidence-url"
                    value={formData.giftStatusEvidenceUrl}
                    onChange={(e) => {
                        setLinkBlurred(false);
                        if (formData.statusEvidence?.type === 'link') {
                            updateFormData('giftStatusEvidenceUrl', e.target.value);
                        }
                    }}
                    onBlur={() => setLinkBlurred(true)}
                    icon={{
                        component: <Link size={14} color="#266dd3" />,
                        direction: 'left'
                    }}
                />
            </AuditSectionCard>
            <SingleSectionQuestion type="textarea" heading='Status Notes' lines={6} id='core_1__status-notes' required={true} />
            <div className='flex gap-4 mb-8'>
                <Button className="w-36" variant='primary'>Preview</Button>
                <Button className="w-36" variant={'outline'}>Cancel</Button>
            </div>
        </>
    )
}

export default CoreArea1