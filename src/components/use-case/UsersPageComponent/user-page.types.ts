import { IProps } from "@/components/common/TextFieldComponent";
import type { CountriesInKebab } from "@/components/common/CountrySelectComponent/countries.types";

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
    country: FieldState<CountriesInKebab | ''>;
    postalcode: FieldState<string>;
    roles: FieldState<string[]>;
}
