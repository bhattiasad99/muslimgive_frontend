import React, { FC } from 'react'
type IProps = {
    color?: string
}
const Charities: FC<IProps> = ({ color = '#112133' }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.3335 5.1665H12.6668" stroke={color} strokeLinecap="round" />
            <path d="M3.3335 8.5H10.0002" stroke={color} strokeLinecap="round" />
            <path d="M3.3335 11.8335H7.3335" stroke={color} strokeLinecap="round" />
        </svg>

    )
}

export default Charities