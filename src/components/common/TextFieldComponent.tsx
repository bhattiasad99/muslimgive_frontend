import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { randomUUID } from "crypto"
import { FC } from "react"

type IProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string,
    id?: string | null,
    placeholder?: string
}

export const TextFieldComponent: FC<IProps> = ({ type = "text", label, placeholder, id, ...otherProps }) => {
    const getId = id ? id : randomUUID()
    return (
        <div className="flex flex-col w-full items-center gap-1">
            {label ? <Label className="w-full text-sm" htmlFor={getId}>{label}</Label> : null}
            <Input className="w-full border-[#dee1e4]" type={type} id={getId} placeholder={placeholder ?? ""} />
        </div>
    )
}