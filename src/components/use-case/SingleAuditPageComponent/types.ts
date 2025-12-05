
export type QuestionType = 'radio' | 'checkbox' | 'text' | 'textarea'

export type BaseProps<T extends QuestionType> = {
    heading: string,
    type: T,
    id: string,
    required: boolean
}

export type RadioProps = BaseProps<'radio'> & {
    options: string[]
}

export type CheckboxProps = BaseProps<'checkbox'> & {
    options: string[]
}

export type TextFieldProps = BaseProps<'text'> & {
    placeholder?: string,
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export type TextareaProps = BaseProps<'textarea'> & {
    placeholder?: string,
    lines: number
}

export type SingleQuestionProps = RadioProps | CheckboxProps | TextFieldProps | TextareaProps