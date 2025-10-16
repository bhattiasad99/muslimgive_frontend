import React, { useState } from 'react'

const AddUserModel = () => {
    // user -> firstName, lastName, email, dob, phone, country, city, postalcode, roles
    const [user, setUser] = useState({
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
            value: '',
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
    return (
        <div>AddUserModel</div>
    )
}

export default AddUserModel