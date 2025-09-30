'use client'
import React, { FC } from 'react'
import { TextFieldComponent } from '../TextFieldComponent'
import SearchIcon from '../IconComponents/SearchIcon'
import clsx from 'clsx'

type IProps = {
    setQuery: (e: string) => void,
    query: string,
    className?: string,
    placeholder?: string
}

const ControlledSearchBarComponent: FC<IProps> = ({ query, setQuery, className, placeholder = 'Search' }) => {
    return (
        <TextFieldComponent
            className={clsx("w-full", className)}
            placeholder={placeholder}
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(e.target.value)
            }}
            icon={{ direction: 'left', component: <SearchIcon /> }}
        />
    )
}

export default ControlledSearchBarComponent