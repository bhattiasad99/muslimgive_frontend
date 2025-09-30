import React from 'react';

type IProps = {
    color?: string
}

const EmailIcon: React.FC<IProps> = ({ color = 'white' }) => {
    return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="14" height="11" rx="2" stroke={color} />
        <path d="M3.3335 7.5L9.10574 10.3861C9.66879 10.6676 10.3315 10.6676 10.8946 10.3861L16.6668 7.5" stroke={color} />
    </svg>

};

export default EmailIcon;