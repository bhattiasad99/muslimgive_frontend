import { FileStatusEvidence, LinkStatusEvidence } from "./CoreArea1_CharityStatus";

type Arr<T> = T[];

export type CoreArea3Values = {
    'clear-public-zakat-policy-available': Arr<
        | 'some-policy'
        | 'guidelines'
        | 'explanation'
        | 'details-of-position'
        | 'governance'
    >;

    'turnaround-time-for-zakat-distribution-disclosed': Arr<
        | 'zakat-paid-within-1-year'
        | 'ownership-completely-transferred'
        | 'no-overdue-funds'
        | 'payment-on-statements'
    >;

    'explanation-and-actions-outlined-for-zakat-undistributed-beyond-one-lunar-year': Arr<
        | 'all-funds-used'
        | 'nothing-overdue'
        | 'documented'
        | 'reflected-on-financial-statement'
        | 'overdue-funds-explanation-solution'
        | 'funds-overdue-resolution'
    >;

    'disclosure-of-zakat-management-administration-fees': Arr<
        | 'low-admin-fees'
        | 'governed-admin-fees'
        | 'explanation'
        | 'details-of-positions'
        | 'governance'
    >;

    'clear-separation-of-zakat-funds-from-general-donations': Arr<
        | 'some-policy'
        | 'guidelines'
        | 'publicly-marketed'
        | 'reflected-on-financial-statement'
        | 'percentage-cap'
        | 'transparent-admin-fees'
    >;

    'vetting-process-for-zakat-funds-application': Arr<
        | 'some-policy'
        | 'guidelines'
        | 'publicly-marketed'
        | 'reflected-on-financial-statement'
        | 'percentage-cap'
        | 'transparent-admin-fees'
    >;

    'zakat-policy-clearly-labeled-and-accessible': Arr<
        | 'clearly-stated-zakat-policy'
        | 'clearly-stated-zakat-policy-little-info'
        | 'explanation-on-zakat'
        | 'charity-usage-explained'
        | 'supporting-policy-quran-hadith'
        | 'zakat-managed-full-info'
        | 'zakat-managed-little-info'
    >;

    'shariah-advisory-board-established': Arr<
        | 'sab-established'
        | 'sab-advise'
        | 'sab-set-policies'
        | 'sab-review'
        | 'sab-audit'
        | 'scholars-advising'
        | 'non-scholars-advising'
    >;

    'names-of-shariah-advisory-board-listed': Arr<
        | 'names-roles'
        | 'pictures'
    >;

    'individuals-serving-on-the-governing-board': Arr<
        | 'names-roles'
        | 'pictures'
        | 'impact-report'
        | 'compliance-statement'
    >;

    'explanation-of-compliance-with-regulations': Arr<
        | 'financial-statement'
        | 'financial-audit'
        | 'impact-report'
    >;

    'explanation-why-zakat-funds-are-collected-and-distributed': Arr<
        | 'clear-mention'
        | 'vague-mention'
    >;

    'clear-explanation-of-zakat-fund-flow': Arr<
        | 'clear-policy-transfer'
        | 'governance-all-campaigns'
        | 'governance-some-campaigns'
        | 'reference-to-ownership'
        | 'vague-mention-ownership'
    >;

    'clear-mention-of-zakat-used-for-adults-and-minors': Arr<
        | 'clear-mention-explanation'
        | 'support-for-minors'
    >;

    'purpose-of-zakat-collection': Arr<
        | 'forms-of-payment-mentioned'
        | 'fop-in-accordance-with-authority'
        | 'fop-governed-by-shariah'
    >;

    'audit-procedures': Arr<
        | 'audit-available'
        | 'auditor-names-data'
    >;

    'mention-of-zakat-eligibility-criteria': Arr<
        | 'clear-eligibility-process'
        | 'eligibility-governance'
    >;

    'disclosure-of-public-fundraising-costs': Arr<
        | 'event-costs'
        | 'admin-costs'
        | 'influencer-speaker-costs'
    >;

    'zakat-calculator-on-website': Arr<
        | 'detailed-zakat-calculator'
        | 'simple-zakat-calculator'
    >;

    'zakat-education-bank': Arr<
        | 'education-bank-articles'
        | 'faqs'
    >;

    'live-zakat-calculation-support': Arr<
        | 'live-zakat-support'
        | 'email-support'
        | 'call-support'
    >;

    'formal-approval-on-zakat-campaigns': Arr<
        | 'zakat-approval-scholars'
        | 'written-approval'
        | 'governance'
    >;

    'details-on-the-fuqara-category': Arr<
        | 'category-explained'
        | 'explanation-of-fund-usage'
        | 'assurance-funds-properly-used'
    >;

    'details-on-the-masakin-category': Arr<
        | 'category-explained'
        | 'explanation-of-fund-usage'
        | 'assurance-funds-properly-used'
    >;

    'details-on-the-amilin-alayha-category': Arr<
        | 'category-explained'
        | 'explanation-of-fund-usage'
        | 'assurance-funds-properly-used'
    >;

    'details-on-the-fi-ar-riqab-category': Arr<
        | 'category-explained'
        | 'explanation-of-fund-usage'
        | 'assurance-funds-properly-used'
    >;

    'details-on-the-al-gharimin-category': Arr<
        | 'category-explained'
        | 'explanation-of-fund-usage'
        | 'assurance-funds-properly-used'
    >;

    'details-on-the-fi-sabilillah-category': Arr<
        | 'category-explained'
        | 'explanation-of-fund-usage'
        | 'assurance-funds-properly-used'
    >;

    'details-on-the-ibn-as-sabil-category': Arr<
        | 'category-explained'
        | 'explanation-of-fund-usage'
        | 'assurance-funds-properly-used'
    >;
};


export type CoreArea4Values = {
    'board-members-names-on-website': 'yes' | 'no';
    'number-of-board-members':
    | '3-or-more'
    | '1-to-2'
    | '0';
    'board-members-photos-on-website': 'yes' | 'no';
    'leadership-team-names-on-website': 'yes' | 'no';
    'leadership-photos-on-website': 'yes' | 'no';
    'minimum-3-board-members-at-arms-length': 'yes' | 'no';
}

export type CoreArea2Values = {
    financialsLink?: string;
    taxReturnLink?: string;
    irsReturnsLink?: string;
    craReturnsLink?: string;
    endOfFiscalYear: Date | null;
    charitableRegistrationSince: Date | null;
    analysisDate?: Date | null;
    auditedStatementsAvailable: string;
    pyAuditedStatementsAvailable: string;
    impactReportAvailable: string;
    notes: string;
}

export type CoreArea1Values = {
    charityNumber: number;
    charityCommissionProfileLink: string;
    registrationStatus: 'registered' | 'not_registered' | 'pending';
    eligibleForGiftAid: boolean;
    registrationDate: Date | null;
    statusEvidence: FileStatusEvidence | LinkStatusEvidence | null;
    giftStatusEvidenceUrl: string;
    statusNotes: string;
}