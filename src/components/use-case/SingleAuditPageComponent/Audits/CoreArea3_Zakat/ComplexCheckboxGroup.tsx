import { CheckboxComponent } from '@/components/common/CheckboxComponent'
import { TypographyComponent } from '@/components/common/TypographyComponent';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link, MessageCircleMore } from 'lucide-react';
import React, { FC, useState, useEffect } from 'react'

export type LinkAttached = {
    label: string;
    url: string;
}

type Option = {
    value: string;
    label: string;
}

type IProps = {
    options: Option[];
    label: string;
    id: string,
    required?: boolean;
    defaultStatus?: ComplexCheckboxGroupStatus;
    onUpdate: (status: ComplexCheckboxGroupStatus) => void;
}

export type ComplexCheckboxGroupStatus = {
    selectedOptions: string[];
    linksAdded: LinkAttached[];
    commentsAdded: string;
}

const ComplexCheckboxGroup: FC<IProps> = ({
    id,
    options,
    label,
    required = false,
    defaultStatus,
    onUpdate
}) => {
    const [selection, setSelection] = useState<string[]>(defaultStatus?.selectedOptions || []);
    // Storing simple string URLs for now based on user request "links" array
    const [linksAdded, setLinksAdded] = useState<string[]>(defaultStatus?.linksAdded?.map(l => l.url) || []);
    const [newLink, setNewLink] = useState('');
    const [commentAdded, setCommentAdded] = useState<string>(defaultStatus?.commentsAdded || '');

    // UI toggles
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showNoteInput, setShowNoteInput] = useState(false);

    // Flag to prevent infinite loop: defaultStatus -> local state -> onUpdate -> defaultStatus ...
    const isSyncingFromProps = React.useRef(false);

    // Sync local state with defaultStatus if it changes (e.g. prefill loaded async)
    useEffect(() => {
        if (defaultStatus) {
            const currentLinks = defaultStatus.linksAdded?.map(l => l.url) || [];

            // basic check to see if we actually need to update checking length or content would be better but simple ref check breaks the loop
            isSyncingFromProps.current = true;
            setSelection(defaultStatus.selectedOptions || []);
            setLinksAdded(currentLinks);
            setCommentAdded(defaultStatus.commentsAdded || '');
        }
    }, [defaultStatus]);

    // Sync to parent whenever local state changes
    useEffect(() => {
        if (isSyncingFromProps.current) {
            isSyncingFromProps.current = false;
            return;
        }

        onUpdate({
            selectedOptions: selection,
            // Parent expects LinkAttached[] but our Preview expects string[]? 
            // The type definition says LinkAttached[] in this file, but index.tsx usage might need checking.
            // Let's stick to the type definition in this file for now and map it.
            linksAdded: linksAdded.map(url => ({ label: 'Link', url })),
            commentsAdded: commentAdded
        })
    }, [selection, linksAdded, commentAdded]);

    const handleAddLink = () => {
        if (newLink.trim()) {
            setLinksAdded([...linksAdded, newLink.trim()]);
            setNewLink('');
            setShowLinkInput(false);
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <Label><TypographyComponent className='font-semibold text-sm'>{label}{required && <span className="text-red-400">*</span>}</TypographyComponent></Label>
            <div className="flex flex-col gap-2">
                {options.map(eachOption => <CheckboxComponent className='cursor-pointer' descriptionClassName='cursor-pointer' label={eachOption.label}
                    key={eachOption.value}
                    checked={selection.includes(eachOption.value)} onCheckedChange={(checked) => {
                        if (checked) {
                            setSelection((prev) => [...prev, eachOption.value])
                        } else {
                            setSelection((prev) => prev.filter(item => item !== eachOption.value))
                        }
                    }} />)}
            </div>

            {/* Links Section */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-4">
                    <Button
                        className='bg-[#F7F7F7] border border-[#e6e6e6]'
                        variant="outline"
                        size={"icon"}
                        onClick={() => setShowLinkInput(!showLinkInput)}
                    >
                        <Link color='#266DD3' />
                    </Button>
                    <TypographyComponent className='text-xs text-[#666E76] italic'>
                        {linksAdded.length} link{linksAdded.length !== 1 ? 's' : ''} attached
                    </TypographyComponent>
                </div>

                {showLinkInput && (
                    <div className="flex gap-2 items-center mt-2">
                        <input
                            type="text"
                            className="border p-2 rounded text-sm w-full"
                            placeholder="https://example.com"
                            value={newLink}
                            onChange={(e) => setNewLink(e.target.value)}
                        />
                        <Button size="sm" onClick={handleAddLink}>Add</Button>
                    </div>
                )}

                {linksAdded.length > 0 && (
                    <ul className="list-disc pl-5 text-xs text-blue-600">
                        {linksAdded.map((link, idx) => (
                            <li key={idx} className="flex justify-between items-center w-full max-w-sm">
                                <span className="truncate">{link}</span>
                                <span
                                    className="cursor-pointer text-red-500 ml-2"
                                    onClick={() => setLinksAdded(linksAdded.filter((_, i) => i !== idx))}
                                >
                                    x
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Notes Section */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-4">
                    <Button
                        className='bg-[#F7F7F7] border border-[#e6e6e6]'
                        variant="outline"
                        size={"icon"}
                        onClick={() => setShowNoteInput(!showNoteInput)}
                    >
                        <MessageCircleMore color='#266DD3' />
                    </Button>
                    <TypographyComponent className='text-xs text-[#666E76] italic'>
                        {commentAdded ? 'Note Added' : 'No Note Added'}
                    </TypographyComponent>
                </div>

                {(showNoteInput || commentAdded) && (
                    <div className="mt-2">
                        <textarea
                            className="border p-2 rounded text-sm w-full h-24"
                            placeholder="Add your notes here..."
                            value={commentAdded}
                            onChange={(e) => setCommentAdded(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ComplexCheckboxGroup
