'use client'
import React, { FC } from 'react'
import SingleRadioQuestion from './SingleRadioQuestion'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'

const DEFINITIONS = {
    'board-members-names-on-website': {
        id: 'board-members-names-on-website',
        label: "Are Board Members’ Names Featured on Website?",
        required: true,
        options: [{
            label: "Yes",
            value: "yes"
        },
        {
            label: "No",
            value: "no"
        }]
    },
    'number-of-board-members': {
        id: 'number-of-board-members',
        label: "Number of Board Members",
        required: true,
        options: [
            {
                label: "3 or more",
                value: '3-or-more'
            },
            {
                label: '1 to 2',
                value: '1-to-2'
            },
            {
                label: '0',
                value: '0'
            }
        ]
    },
    'board-members-photos-on-website': {
        label: "Are Board Members’ Photos Featured on Website?",
        id: 'board-members-photos-on-website',
        required: true,
        options: [
            {
                label: "Yes",
                value: "yes"
            },
            {
                label: "No",
                value: 'no'
            }
        ]
    },
    'leadership-team-names-on-website': {
        label: 'Are Leadership Team Names Featured on Website?',
        id: 'leadership-team-names-on-website',
        required: true,
        options: [
            {
                label: "Yes",
                value: "yes"
            },
            {
                label: "No",
                value: 'no'
            }
        ]
    },
    'leadership-photos-on-website': {
        label: 'Are Leadership Photos Featured on Website?',
        required: true,
        id: 'leadership-photos-on-website',
        options: [
            {
                label: "Yes",
                value: "yes"
            },
            {
                label: "No",
                value: 'no'
            }
        ]
    },
    'minimum-3-board-members-at-arms-length': {
        label: 'Are there Minimum 3 Board Members at Arm’s Length?',
        required: true,
        id: 'minimum-3-board-members-at-arms-length',
        options: [
            {
                label: "Yes",
                value: "yes"
            },
            {
                label: "No",
                value: 'no'
            }
        ]
    }
};

type Keys = keyof typeof DEFINITIONS;


type State = { [K in Keys]: typeof DEFINITIONS[K]["options"][number]["value"] | "" };

const CoreArea4: FC<{ charityId: string }> = ({ charityId }) => {
    const emptyState = Object.fromEntries(
        (Object.keys(DEFINITIONS) as Keys[]).map(k => [k, ""])
    ) as State;
    const [formVals, setFormVals] = React.useState<State>(emptyState);
    const keys = Object.keys(DEFINITIONS) as Keys[];
    const router = useRouter();
    return (
        <>
            {keys.map(key => {
                const def = DEFINITIONS[key];
                return (
                    <SingleRadioQuestion
                        key={def.id}
                        id={def.id}
                        label={def.label}
                        options={[...def.options]}
                        value={formVals[key]}
                        onChange={(newVal) =>
                            setFormVals(prev => ({ ...prev, [key]: newVal }))
                        }
                    />
                );
            })}
            <div className='flex gap-4 mb-8'>
                <Button className="w-36" variant='primary' disabled={Object.values(formVals).some(val => val === "")} onClick={() => {
                    router.push(`/charities/${charityId}/audits/core-area-2?preview-mode=true`)
                }}>Preview</Button>
                <Button className="w-36" variant={'outline'}>Cancel</Button>
            </div>
        </>
    );
}

export default CoreArea4
