import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { UserForm } from './user-page.types'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import ControlledDatePickerComponent from '@/components/common/ControlledDatePickerComponent'
import SelectComponent from '@/components/common/SelectComponent'
import MultiSelectComboboxComponent from '@/components/common/MultiSelectComboboxComponent'

import { createMgMemberAction } from '@/app/actions/users'
import { listRolesAction } from '@/app/actions/roles'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type IProps = {
    onClose?: () => void
    onSuccess?: () => void
}

const AddUserModel: React.FC<IProps> = ({ onClose, onSuccess }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [availableRoles, setAvailableRoles] = useState<{ value: string, label: string }[]>([])
    // user -> firstName, lastName, email, dob, phone, country, city, postalcode, roles
    const [user, setUser] = useState<UserForm>({
        firstName: {
            value: '',
            error: ''
        },
        lastName: {
            value: '',
            error: ''
        },
        email: {
            value: '',
            error: ''
        },
        dob: {
            value: undefined,
            error: ''
        },
        phone: {
            value: '',
            error: ''
        },
        country: {
            value: '',
            error: ''
        },
        city: {
            value: '',
            error: ''
        },
        postalcode: {
            value: '',
            error: ''
        },
        roles: {
            value: [],
            error: ''
        }
    })

    const updateFormValue = <K extends keyof UserForm>(label: K, value: UserForm[K]['value']) => {
        setUser(prev => ({
            ...prev,
            [label]: { ...prev[label], value },
        }));
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await listRolesAction()
                if (res.ok && res.payload?.data?.data) {
                    const rolesData = res.payload.data.data
                    // Map to { value: id, label: title }
                    const mappedRoles = Array.isArray(rolesData)
                        ? rolesData.map((r: any) => ({ value: r.id, label: r.title }))
                        : []
                    setAvailableRoles(mappedRoles)
                }
            } catch (error) {
                console.error("Failed to fetch roles", error)
                toast.error("Failed to load roles")
            }
        }
        fetchRoles()
    }, [])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const payload = {
            firstName: user.firstName.value,
            lastName: user.lastName.value,
            email: user.email.value,
            dateOfBirth: user.dob.value ? new Date(user.dob.value).toISOString().split('T')[0] : undefined, // Format: YYYY-MM-DD
            phoneNumber: user.phone.value,
            countryName: user.country.value,
            city: user.city.value,
            postalCode: user.postalcode.value,
            roles: user.roles.value,
        }

        try {
            const res = await createMgMemberAction(payload as any) // Type cast if necessary, or strict type the payload
            if (res.ok) {
                toast.success("User created successfully")
                if (onSuccess) {
                    onSuccess()
                }
            } else {
                toast.error(res.message || "Failed to create user")
            }
        } catch (error) {
            console.error("Failed to create user", error)
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className="flex items-center">
                <label htmlFor='add_user__fName' className='w-50'>
                    First Name
                </label>
                <ControlledTextFieldComponent
                    value={user.firstName.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormValue('firstName', e.target.value)} name="fName" id='add_user__fName' />
            </div>
            <div className="flex items-center">
                <label htmlFor='add_user__lName' className='w-50'>
                    Last Name
                </label>
                <ControlledTextFieldComponent
                    value={user.lastName.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormValue('lastName', e.target.value)} name="lName" id='add_user__lName' />
            </div>
            <div className="flex items-center">
                <label htmlFor='add_user__email' className='w-50'>
                    Email
                </label>
                <ControlledTextFieldComponent
                    value={user.email.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormValue('email', e.target.value)} name="email" id='add_user__email' />
            </div>
            <div className="flex items-center">
                <label htmlFor='add_user__dob' className='w-50'>
                    Date of Birth
                </label>
                <ControlledDatePickerComponent
                    value={user.dob.value}
                    onChange={(updatedDate) => {
                        updateFormValue('dob', updatedDate)
                    }}
                    id="add_user__dob"
                    label="Date of birth"
                />
            </div>
            <div className="flex items-center">
                <label htmlFor='add_user__phone' className='w-50'>
                    Phone Number
                </label>
                <ControlledTextFieldComponent
                    value={user.phone.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormValue('phone', e.target.value)} name="phone" id='add_user__phone' />
            </div>
            <div className="flex items-center">
                <label htmlFor='add_user__country' className='w-50'>
                    Country
                </label>
                <SelectComponent
                    id="add_user__country"
                    value={user.country.value}
                    onChange={(e) => updateFormValue('country', e)}
                    options={[
                        { value: "canada", label: "Canada" },
                        { value: "uk", label: "United Kingdom" },
                        { value: "usa", label: "United States of America" },
                    ]}
                />
            </div>
            <div className="flex items-center">
                <label htmlFor='add_user__postalcode' className='w-50'>
                    Postal Code
                </label>
                <ControlledTextFieldComponent
                    value={user.postalcode.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormValue('postalcode', e.target.value)} name="postalcode" id='add_user__postalcode' />
            </div>
            <div className="flex items-start  w-full">
                <label htmlFor='add_user__roles' className='w-50'>
                    Roles
                </label>
                <div className="flex flex-col gap-1 w-full">
                    <MultiSelectComboboxComponent
                        value={user.roles.value} onChange={(e) => updateFormValue('roles', e)} id='add_user__roles'
                        options={availableRoles}
                    />
                    {/*  */}
                    {/* <div className="flex gap-2">
                        <Badge variant={"outline"}>Finance Manager</Badge>
                        <Badge variant={"outline"}>Operations Manager Manager</Badge>
                    </div> */}
                </div>

            </div>
            <Button variant={"primary"} type="submit" loading={loading}>Create Profile</Button>
            <Button variant={"outline"} type="button" onClick={onClose} disabled={loading}>Cancel</Button>
        </form>
    )
}

export default AddUserModel