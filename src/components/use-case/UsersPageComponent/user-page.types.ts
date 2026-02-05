import { IProps } from "@/components/common/TextFieldComponent";

export type SingleTextFieldRowPropTypes = {
    id: string,
    label: string,
    value: string,
    onChange: (e: string) => void,
    textFieldProps?: IProps
}

export interface FieldState<T = any> {
    value: T;
    error: string;
}

export interface UserForm {
    firstName: FieldState<string>;
    lastName: FieldState<string>;
    email: FieldState<string>;
    dob: FieldState<Date | undefined>;
    country: FieldState<string>;
    city: FieldState<string>;
    postalcode: FieldState<string>;
    roles: FieldState<string[]>;
}
