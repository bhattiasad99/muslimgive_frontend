import React, { FC, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type IProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultSubject?: string
    onSend: (subject: string, body: string) => void
}

const EmailReplyModal: FC<IProps> = ({ open, onOpenChange, defaultSubject = '', onSend }) => {
    const [subject, setSubject] = useState(defaultSubject)
    const [body, setBody] = useState('')

    useEffect(() => {
        if (open) {
            setSubject(defaultSubject)
            setBody('')
        }
    }, [open, defaultSubject])

    const handleSend = () => {
        onSend(subject, body)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Reply to Email</DialogTitle>
                    <DialogDescription>
                        Compose your reply below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                            Subject
                        </Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="body" className="text-right mt-3">
                            Body
                        </Label>
                        <Textarea
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="col-span-3"
                            rows={5}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSend}>Send Reply</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmailReplyModal
