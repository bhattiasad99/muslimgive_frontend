import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { UserForm } from './user-page.types'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import ControlledDatePickerComponent from '@/components/common/ControlledDatePickerComponent'
import SelectComponent from '@/components/common/SelectComponent'
import MultiSelectPicker from '@/components/common/MultiSelectPicker'
import ComboboxComponent from '@/components/common/MultiSelectComboboxComponent'
import { Badge } from '@/components/ui/badge'
import MultiSelectComboboxComponent from '@/components/common/MultiSelectComboboxComponent'

const AddUserModel = () => {
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

    return (
        <form className='flex flex-col gap-4'>
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
                        options={[
                            {
                                value: "finance-manager",
                                label: "Finance Manager"
                            },
                            {
                                value: "operations-manager",
                                label: "Operations Manager"
                            },
                            {
                                value: "project-manager",
                                label: "Project Manager"
                            },
                            {
                                value: "zakat auditor",
                                label: "Zakat Auditor"
                            },
                        ]}
                    />
                    {/*  */}
                    {/* <div className="flex gap-2">
                        <Badge variant={"outline"}>Finance Manager</Badge>
                        <Badge variant={"outline"}>Operations Manager Manager</Badge>
                    </div> */}
                </div>

            </div>
            <Button variant={"primary"}>Create Profile</Button>
            <Button variant={"outline"}>Cancel</Button>
        </form>
    )
}

export default AddUserModel