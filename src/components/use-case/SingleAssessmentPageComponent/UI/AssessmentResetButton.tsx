'use client'

import { FC, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'

type AssessmentResetButtonProps = {
    onReset: () => void | Promise<void>
    disabled?: boolean
    className?: string
    label?: string
}

/**
 * Clears the current assessment answers so the assessor can start again.
 */
export const AssessmentResetButton: FC<AssessmentResetButtonProps> = ({
    onReset,
    disabled = false,
    className,
    label = 'Reset assessment',
}) => {
    const [open, setOpen] = useState(false)
    const [isResetting, setIsResetting] = useState(false)

    const handleConfirmReset = async () => {
        if (isResetting) return

        setIsResetting(true)
        try {
            await onReset()
            setOpen(false)
            toast.success('Assessment reset. You can start again.')
        } catch (error) {
            console.error('Failed to reset assessment', error)
            toast.error('Failed to reset assessment. Please try again.')
        } finally {
            setIsResetting(false)
        }
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                className={cn(
                    'h-9 gap-2 border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-950',
                    className,
                )}
                disabled={disabled || isResetting}
                onClick={() => setOpen(true)}
            >
                <RotateCcw className="size-4" />
                {label}
            </Button>

            <ModelComponentWithExternalControl
                open={open}
                onOpenChange={(nextOpen) => {
                    if (isResetting) return
                    setOpen(nextOpen)
                }}
                title="Reset assessment?"
                description="All current answers will be cleared and you can start this assessment again from scratch."
                dialogContentClassName="sm:max-w-[420px]"
            >
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        disabled={isResetting}
                        onClick={() => setOpen(false)}
                    >
                        Keep answers
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        className="w-full bg-amber-600 hover:bg-amber-700 sm:w-auto"
                        loading={isResetting}
                        disabled={isResetting}
                        onClick={handleConfirmReset}
                    >
                        {isResetting ? 'Resetting...' : 'Reset & start again'}
                    </Button>
                </div>
            </ModelComponentWithExternalControl>
        </>
    )
}

export default AssessmentResetButton
