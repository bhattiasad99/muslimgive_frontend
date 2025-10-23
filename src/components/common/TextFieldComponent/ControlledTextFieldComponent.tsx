import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { randomUUID } from "crypto"
import { FC } from "react"

type IProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string,
    id?: string | null,
    placeholder?: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
}

export const ControlledTextFieldComponent: FC<IProps> = ({ type = "text", value, onChange, name, label, placeholder, id, onBlur, ...rest }) => {
    const getId = id ? id : randomUUID()
    return (
        <div className="flex flex-col w-full items-center gap-1">
            {label ? <Label className="w-full text-sm" htmlFor={getId}>{label}</Label> : null}
            <Input onBlur={() => {
                if (onBlur) {
                    onBlur()
                }
            }} name={name} value={value} onChange={onChange} className="w-full " type={type} id={getId} placeholder={placeholder ?? ""}
                {...rest}
            />
        </div>
    )
}