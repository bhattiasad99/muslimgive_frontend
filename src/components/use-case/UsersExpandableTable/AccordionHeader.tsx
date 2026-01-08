import { kanit } from '@/app/fonts';
import ThreeDotIcon from '@/components/common/IconComponents/ThreeDotIcon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { PopoverTrigger } from '@radix-ui/react-popover';
import React, { FC } from 'react'

type IProps = {
    id: string,
    firstName: string,
    lastName: string,
    status: "Active" | "Inactive",
    location: string,
    isOpen: boolean,
    setOpenId: (val: string | null) => void;
    close: () => void;
}

const AccordionHeader: FC<IProps> = ({ id, firstName, lastName, status, location, isOpen, setOpenId }) => {
    return (
        <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className={cn("w-fit text-gray-600 bg-gray-100 border border-gray-300 text-xs p-0.5 rounded-lg flex justify-center font-normal px-2", kanit.className)}>
                {id}
            </p>
            <p className="md:min-w-[150px]">
                {firstName} {lastName}
            </p>
            <p className="md:min-w-[150px]">{location}</p>
            <div className="md:w-[100px] flex justify-center items-center">
                <p
                    className={cn(
                        'px-3 py-0.5 text-xs rounded-lg flex justify-center border',
                        status === 'Active'
                            ? 'bg-[#5CF269] border-[#57de62]'
                            : 'bg-[#F25F5C] text-white border-[#e75b59]'
                    )}
                >
                    {status}
                </p>
            </div>
            <Popover
                open={isOpen}
                onOpenChange={(next) => setOpenId(next ? id : null)}
            >
                <PopoverTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        size="icon"
                        variant="ghost"
                        aria-label="User actions"
                    >
                        <ThreeDotIcon />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="end"
                    className="w-fit p-2"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <Button
                        variant="outline"
                        // variant={
                        //     status === 'Active' ? 'destructive' : 'primary'
                        // }
                        className={cn(status === "Active" ? 'text-red-400' : 'text-primary')}
                        onClick={(e) => {
                            e.stopPropagation()
                            // TODO: call activate/deactivate here
                            close()
                        }}
                    >
                        {status === 'Active'
                            ? 'Deactivate User'
                            : 'Activate User'}
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default AccordionHeader
