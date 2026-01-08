import { formatLabel } from "@/lib/helpers";
import React, { FC } from "react";

type IProps = {
    items: Record<string, string>[];
};

const SimpleCardDataFormat: FC<IProps> = ({ items }) => {
    return (
        <div className="flex flex-wrap justify-between gap-y-2 ">
            {items.map((obj, index) => {
                // get the only [key, value] pair in this object
                const [[label, value]] = Object.entries(obj);

                return (
                    <div
                        key={`${label}-${index}`}
                        className="flex flex-col min-w-0 w-full sm:w-1/2 lg:w-1/3"
                    >
                        <span className="text-xs text-[#666E76]">{formatLabel(label)}</span>
                        <span>{value}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default SimpleCardDataFormat;
