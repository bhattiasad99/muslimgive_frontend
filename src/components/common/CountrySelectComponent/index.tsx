import { Country, CountryDropdown } from '@/components/ui/country-dropdown'
import type {
  CountriesInAlpha2,
  CountriesInAlpha3,
  CountriesInKebab,
} from './countries.types'
import React, { FC, useCallback } from 'react'

type IProps = {
  value?: CountriesInKebab;
  onChange?: (countryCode: CountriesInKebab, obj: Country) => void;
  // Default: all countries available
  // Example: allowedCountries={["CA", "GBR", "united-states"]} // alpha-2, alpha-3, or kebab-case name
  // Example: allowedCountries={["ca", "gbr", "united-kingdom"]}
  allowedCountries?: Array<
    | CountriesInAlpha2
    | CountriesInAlpha3
    | CountriesInKebab
    | Uppercase<CountriesInAlpha2 | CountriesInAlpha3>
  >;
  // Advanced override: provide a full custom list
  // Example: options={[{ alpha2: "CA", alpha3: "CAN", ... }]}
  options?: Country[];
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
}

const toKebab = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const CountrySelectComponent: FC<IProps> = ({
  value,
  onChange,
  options,
  allowedCountries,
  disabled,
  placeholder,
  slim,
}) => {
  const handleChange = useCallback(
    (country: Country) => {
      onChange?.(toKebab(country.name) as CountriesInKebab, country);
    },
    [onChange]
  );

  return (
    <CountryDropdown
      options={options}
      allowedCountries={allowedCountries}
      onChange={handleChange}
      defaultValue={value}
      disabled={disabled}
      placeholder={placeholder}
      slim={slim}
    />
  )
}

export default CountrySelectComponent
