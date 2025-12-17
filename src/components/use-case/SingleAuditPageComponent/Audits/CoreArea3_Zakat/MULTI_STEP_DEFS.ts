import { LinkAttached } from "./ComplexCheckboxGroup";

type Option = {
    value: string;
    label: string
}

export type QuestionDef = {
    label: string;
    options: Option[];
    id: string;
}

type SingleStep = {
    0: QuestionDef[],
    1: QuestionDef[],
    2: QuestionDef[],
    3: QuestionDef[],
    4: QuestionDef[]
}

export const MULTI_STEP_DEFS: SingleStep = {
    0: [
        {
            label: 'Clear public Zakat Policy available',
            id: 'clear-public-zakat-policy-available',
            options: [
                {
                    value: 'some-policy',
                    label: "Some Policy"
                },
                {
                    value: 'guidelines',
                    label: "Guidelines"
                },
                {
                    value: 'explanation',
                    label: "Explanation"
                },
                {
                    value: 'details-of-position',
                    label: "Details of Position"
                },
                {
                    value: 'governance',
                    label: "Governance"
                }
            ]
        },
        {
            label: 'Turnaround time for Zakat distribution disclosed',
            id: 'turnaround-time-for-zakat-distribution-disclosed',
            options: [
                { value: 'zakat-paid-within-1-year', label: 'Zakat paid within 1 year' },
                { value: 'ownership-completely-transferred', label: 'Ownership completely transferred' },
                { value: 'no-overdue-funds', label: 'No overdue funds' },
                { value: 'payment-on-statements', label: 'Payment on statements' }
            ]
        },
        {
            label: 'Explanation and actions outlined for Zakat undistributed beyond one lunar year',
            id: 'explanation-and-actions-outlined-for-zakat-undistributed-beyond-one-lunar-year',
            options: [
                { value: 'all-funds-used', label: 'All funds used' },
                { value: 'nothing-overdue', label: 'Nothing overdue' },
                { value: 'documented', label: 'Documented' },
                { value: 'reflected-on-financial-statement', label: 'Reflected on financial statement' },
                { value: 'overdue-funds-explanation-solution', label: 'Overdue funds + explanation and solution' },
                { value: 'funds-overdue-resolution', label: 'Funds overdue + mention of resolution' }
            ]
        },
        {
            label: 'Disclosure of Zakat management/administration fees',
            id: 'disclosure-of-zakat-management-administration-fees',
            options: [
                { value: 'low-admin-fees', label: 'Low admin fees' },
                { value: 'governed-admin-fees', label: 'Governed admin fees' },
                { value: 'explanation', label: 'Explanation' },
                { value: 'details-of-positions', label: 'Details of positions' },
                { value: 'governance', label: 'Governance' }
            ]
        },
        {
            label: 'Clear separation of Zakat funds from general donations',
            id: 'clear-separation-of-zakat-funds-from-general-donations',
            options: [
                { value: 'some-policy', label: 'Some Policy' },
                { value: 'guidelines', label: 'Guidelines' },
                { value: 'publicly-marketed', label: 'Publicly marketed' },
                { value: 'reflected-on-financial-statement', label: 'Reflected on financial statement' },
                { value: 'percentage-cap', label: 'Percentage cap' },
                { value: 'transparent-admin-fees', label: 'Transparent admin fees' }
            ]
        },
        {
            label: 'Vetting process for Zakat funds application',
            id: 'vetting-process-for-zakat-funds-application',
            options: [
                { value: 'some-policy', label: 'Some Policy' },
                { value: 'guidelines', label: 'Guidelines' },
                { value: 'publicly-marketed', label: 'Publicly marketed' },
                { value: 'reflected-on-financial-statement', label: 'Reflected on financial statement' },
                { value: 'percentage-cap', label: 'Percentage cap' },
                { value: 'transparent-admin-fees', label: 'Transparent admin fees' }
            ]
        }
    ],
    1: [
        {
            label: 'Zakat policy clearly labeled and accessible',
            id: 'zakat-policy-clearly-labeled-and-accessible',
            options: [
                { value: 'clearly-stated-zakat-policy', label: 'Clearly stated Zakat Policy available' },
                { value: 'clearly-stated-zakat-policy-little-info', label: 'Clearly stated Zakat policy with little info' },
                { value: 'explanation-on-zakat', label: 'Explanation on Zakat' },
                { value: 'charity-usage-explained', label: 'Charity’s usage of Zakat explained' },
                { value: 'supporting-policy-quran-hadith', label: 'Supporting Policy with Quranic Verses or Hadith' },
                { value: 'zakat-managed-full-info', label: 'Zakat managed according to Shariah (full info)' },
                { value: 'zakat-managed-little-info', label: 'Zakat managed according to Shariah (little info)' },

            ]
        },
        {
            label: 'Shariah Advisory board established to advise, set policies, review and audit',
            id: 'shariah-advisory-board-established',
            options: [
                { value: 'sab-established', label: 'SAB established' },
                { value: 'sab-advise', label: 'SAB: advise' },
                { value: 'sab-set-policies', label: 'SAB: set policies' },
                { value: 'sab-review', label: 'SAB: review' },
                { value: 'sab-audit', label: 'SAB: audit' },
                { value: 'scholars-advising', label: 'Scholars advising' },
                { value: 'non-scholars-advising', label: 'Non-scholars advising' },

            ]
        },
        {
            label: 'Names of Shariah Advisory board listed',
            id: 'names-of-shariah-advisory-board-listed',
            options: [
                { value: 'names-roles', label: 'Names + Roles' },
                { value: 'pictures', label: 'Pictures' },

            ]
        },
        {
            label: 'Individuals serving on the governing board',
            id: 'individuals-serving-on-the-governing-board',
            options: [
                { value: 'names-roles', label: 'Names + Roles' },
                { value: 'pictures', label: 'Pictures' },
                { value: 'impact-report', label: 'Impact report with some financial info' },
                { value: 'compliance-statement', label: 'Compliance statement of any sort' },

            ]
        },
        {
            label: 'Explanation of compliance with regulations set out by relevant governmental authority',
            id: 'explanation-of-compliance-with-regulations',
            options: [
                { value: 'financial-statement', label: 'Financial statement' },
                { value: 'financial-audit', label: 'Financial audit' },
                { value: 'impact-report', label: 'Impact report' },

            ]
        },
    ],
    2: [
        {
            label: 'Explanation why zakat funds are collected and distributed',
            id: 'explanation-why-zakat-funds-are-collected-and-distributed',
            options: [
                { value: 'clear-mention', label: 'Clear mention' },
                { value: 'vague-mention', label: 'Vague mention' },

            ]
        },
        {
            label: 'Clear explanation of Zakat fund flow and transfer of ownership (tamlik)',
            id: 'clear-explanation-of-zakat-fund-flow',
            options: [
                { value: 'clear-policy-transfer', label: 'Clear policy on transfer of ownership' },
                { value: 'governance-all-campaigns', label: 'Governance in ALL campaigns' },
                { value: 'governance-some-campaigns', label: 'Governance in SOME campaigns' },
                { value: 'reference-to-ownership', label: 'Reference to ownership within the policy' },
                { value: 'vague-mention-ownership', label: 'Vague mention of ownership' },

            ]
        },
        {
            label: 'Clear mention of Zakat being used to support both adults and minors, with explanation',
            id: 'clear-mention-of-zakat-used-for-adults-and-minors',
            options: [
                { value: 'clear-mention-explanation', label: 'Clear mention + explanation' },
                { value: 'support-for-minors', label: 'Support for minors included in campaign' },

            ]
        },
        {
            label: 'Purpose of Zakat collection + mention of whether zakat is distributed in cash or other forms',
            id: 'purpose-of-zakat-collection',
            options: [
                { value: 'forms-of-payment-mentioned', label: 'Forms of payment mentioned' },
                { value: 'fop-in-accordance-with-authority', label: 'FOP in accordance with government authority' },
                { value: 'fop-governed-by-shariah', label: 'FOP governed by Shariah' },

            ]
        },
        {
            label: 'Audit procedures (internal/external)',
            id: 'audit-procedures',
            options: [
                { value: 'audit-available', label: 'Audit available' },
                { value: 'auditor-names-data', label: 'Auditors names/data available' },
            ]
        },
    ],
    3: [


        {
            label: 'Mention of Zakat eligibility criteria',
            id: 'mention-of-zakat-eligibility-criteria',
            options: [
                { value: 'clear-eligibility-process', label: 'Clear eligibility process' },
                { value: 'eligibility-governance', label: 'Eligibility governance' },

            ]
        },
        {
            label: 'Disclosure of public fundraising costs',
            id: 'disclosure-of-public-fundraising-costs',
            options: [
                { value: 'event-costs', label: 'Event costs' },
                { value: 'admin-costs', label: 'Admin costs' },
                { value: 'influencer-speaker-costs', label: 'Influencers/speakers costs' },

            ]
        },
        {
            label: 'Zakat calculator on the website',
            id: 'zakat-calculator-on-website',
            options: [
                { value: 'detailed-zakat-calculator', label: 'Detailed zakat calculator' },
                { value: 'simple-zakat-calculator', label: 'Simple zakat calculator' },

            ]
        },
        {
            label: 'Zakat education bank',
            id: 'zakat-education-bank',
            options: [
                { value: 'education-bank-articles', label: 'Education bank, articles, blogs, research papers' },
                { value: 'faqs', label: 'FAQs' },

            ]
        },
        {
            label: 'Live Zakat calculation support',
            id: 'live-zakat-calculation-support',
            options: [
                { value: 'live-zakat-support', label: 'Live zakat support' },
                { value: 'email-support', label: 'Email support' },
                { value: 'call-support', label: 'Call support' },

            ]
        },
        {
            label: 'Formal approval on Zakat campaigns',
            id: 'formal-approval-on-zakat-campaigns',
            options: [
                { value: 'zakat-approval-scholars', label: 'Zakat campaign approval by scholars' },
                { value: 'written-approval', label: 'Written approval' },
                { value: 'governance', label: 'Governance' },

            ]
        },

    ],
    4: [{
        label: 'Details on the Fuqarā category and its recipients',
        id: 'details-on-the-fuqara-category',
        options: [
            { value: 'category-explained', label: 'Category explained in detail' },
            { value: 'explanation-of-fund-usage', label: 'Explanation of fund usage' },
            { value: 'assurance-funds-properly-used', label: 'Assurance funds are properly used' },

        ]
    },
    {
        label: 'Details on the Masākīn category and its recipients',
        id: 'details-on-the-masakin-category',
        options: [
            { value: 'category-explained', label: 'Category explained in detail' },
            { value: 'explanation-of-fund-usage', label: 'Explanation of fund usage' },
            { value: 'assurance-funds-properly-used', label: 'Assurance funds are properly used' },

        ]
    },
    {
        label: 'Details on the Āmilīn ʿAlayhā category in Zakat distribution',
        id: 'details-on-the-amilin-alayha-category',
        options: [
            { value: 'category-explained', label: 'Category explained in detail' },
            { value: 'explanation-of-fund-usage', label: 'Explanation of fund usage' },
            { value: 'assurance-funds-properly-used', label: 'Assurance funds are properly used' },

        ]
    },
    {
        label: 'Details on the Fi Ar-Riqāb category and its recipients',
        id: 'details-on-the-fi-ar-riqab-category',
        options: [
            { value: 'category-explained', label: 'Category explained in detail' },
            { value: 'explanation-of-fund-usage', label: 'Explanation of fund usage' },
            { value: 'assurance-funds-properly-used', label: 'Assurance funds are properly used' },

        ]
    },
    {
        label: 'Details on the Al-Ghārimīn category and its recipients',
        id: 'details-on-the-al-gharimin-category',
        options: [
            { value: 'category-explained', label: 'Category explained in detail' },
            { value: 'explanation-of-fund-usage', label: 'Explanation of fund usage' },
            { value: 'assurance-funds-properly-used', label: 'Assurance funds are properly used' },

        ]
    },
    {
        label: 'Details on the Fi Sabīlillāh category and its recipients',
        id: 'details-on-the-fi-sabilillah-category',
        options: [
            { value: 'category-explained', label: 'Category explained in detail' },
            { value: 'explanation-of-fund-usage', label: 'Explanation of fund usage' },
            { value: 'assurance-funds-properly-used', label: 'Assurance funds are properly used' },

        ]
    },
    {
        label: 'Details on the Ibn As-Sabīl category and its recipients',
        id: 'details-on-the-ibn-as-sabil-category',
        options: [
            { value: 'category-explained', label: 'Category explained in detail' },
            { value: 'explanation-of-fund-usage', label: 'Explanation of fund usage' },
            { value: 'assurance-funds-properly-used', label: 'Assurance funds are properly used' },

        ]
    }
    ]
};