"use client"

import React from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type OtpComponentProps = {
  value: string
  onChange: (value: string) => void
  length?: number
  autoFocus?: boolean
  disabled?: boolean
  onComplete?: (value: string) => void
  showSeparator?: boolean
  separatorEvery?: number
  className?: string
  containerClassName?: string
  groupClassName?: string
  slotClassName?: string
}

// Example usage:
// const [otp, setOtp] = React.useState("")
// <OtpComponent
//   value={otp}
//   onChange={setOtp}
//   length={6}
//   onComplete={(val) => console.log(val)}
//   showSeparator
//   separatorEvery={3}
// />
const OtpComponent = ({
  value,
  onChange,
  length = 6,
  autoFocus = false,
  disabled = false,
  onComplete,
  showSeparator = false,
  separatorEvery = 3,
  className,
  containerClassName,
  groupClassName,
  slotClassName,
}: OtpComponentProps) => {
  const slots = React.useMemo(() => Array.from({ length }), [length])

  return (
    <InputOTP
      value={value}
      onChange={onChange}
      maxLength={length}
      autoFocus={autoFocus}
      disabled={disabled}
      onComplete={onComplete}
      className={className}
      containerClassName={containerClassName}
    >
      <InputOTPGroup className={groupClassName}>
        {slots.map((_, index) => (
          <React.Fragment key={index}>
            <InputOTPSlot index={index} className={slotClassName} />
            {showSeparator &&
              separatorEvery > 0 &&
              index < length - 1 &&
              (index + 1) % separatorEvery === 0 && (
                <InputOTPSeparator />
              )}
          </React.Fragment>
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}

export default OtpComponent
