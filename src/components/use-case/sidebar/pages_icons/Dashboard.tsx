import React, { FC } from 'react'
type IProps = {
    color?: string
}
const Dashboard: FC<IProps> = ({ color = 'currentColor' }) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.3335 7.1665L5.3335 11.1665" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 8.5V11.1667" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.6665 5.8335V11.1668" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
            <rect x="2" y="3.1665" width="12" height="10.6667" rx="2" stroke={color} />
        </svg>

    )
}

export default Dashboard