import { CoreArea1Values, CoreArea2Values, CoreArea3Values, CoreArea4Values } from "./components/use-case/SingleAuditPageComponent/Audits/types";

export type AuditIds = 'core-area-1' | 'core-area-2' | 'core-area-3' | 'core-area-4';

type AuditValueType = {
    'core-area-1': CoreArea1Values,
    'core-area-2': CoreArea2Values,
    'core-area-3': CoreArea3Values,
    'core-area-4': CoreArea4Values
}

export const DUMMY_AUDIT_VALUES: AuditValueType = {
    'core-area-1': {
        charityNumber: 123456,
        charityCommissionProfileLink: 'https://www.gov.uk/find-charity-information/example-charity',
        registrationStatus: 'registered',
        eligibleForGiftAid: true,
        registrationDate: new Date('2015-06-12'),
        // statusEvidence: {
        //     type: 'file',
        //     fileInfo: {
        //         id: '1',
        //         url: 'https://example.org/registration-proof',
        //         name: 'registration-proof.pdf',
        //         size: 1024000,
        //         type: 'application/pdf'
        //     }
        // },
        statusEvidence: {
            type: 'link',
            linkUrl: 'https://example.org/registration-proof'
        },
        giftStatusEvidenceUrl: 'https://example.org/gift-aid-proof',
        statusNotes: 'Charity is fully registered and eligible for Gift Aid.'
    },

    'core-area-2': {
        financialsLink: 'https://example.org/financials.pdf',
        taxReturnLink: 'https://example.org/tax-return.pdf',
        irsReturnsLink: '',
        craReturnsLink: '',
        endOfFiscalYear: new Date('2024-12-31'),
        charitableRegistrationSince: new Date('2015-06-12'),
        analysisDate: new Date('2025-01-10'),
        auditedStatementsAvailable: 'Yes – independently audited',
        pyAuditedStatementsAvailable: 'Yes – previous year available',
        impactReportAvailable: 'Yes – annual impact report published',
        notes: 'Financials reviewed and compliant with reporting standards.'
    },

    'core-area-3': {
        'clear-public-zakat-policy-available': ['governance'],
        'turnaround-time-for-zakat-distribution-disclosed': ['zakat-paid-within-1-year'],
        'explanation-and-actions-outlined-for-zakat-undistributed-beyond-one-lunar-year':
            ['documented', "all-funds-used"],
        'disclosure-of-zakat-management-administration-fees': ['governed-admin-fees'],
        'clear-separation-of-zakat-funds-from-general-donations':
            ['reflected-on-financial-statement'],
        'vetting-process-for-zakat-funds-application': ['guidelines'],
        'zakat-policy-clearly-labeled-and-accessible':
            ['zakat-managed-full-info'],
        'shariah-advisory-board-established': ['sab-established'],
        'names-of-shariah-advisory-board-listed': ['names-roles'],
        'individuals-serving-on-the-governing-board': ['names-roles'],
        'explanation-of-compliance-with-regulations': ['financial-audit'],
        'explanation-why-zakat-funds-are-collected-and-distributed':
            ['clear-mention'],
        'clear-explanation-of-zakat-fund-flow': ['clear-policy-transfer'],
        'clear-mention-of-zakat-used-for-adults-and-minors':
            ['clear-mention-explanation'],
        'purpose-of-zakat-collection': ['fop-governed-by-shariah'],
        'audit-procedures': ['audit-available'],
        'mention-of-zakat-eligibility-criteria': ['clear-eligibility-process'],
        'disclosure-of-public-fundraising-costs': ['admin-costs'],
        'zakat-calculator-on-website': ['detailed-zakat-calculator'],
        'zakat-education-bank': ['education-bank-articles'],
        'live-zakat-calculation-support': ['live-zakat-support'],
        'formal-approval-on-zakat-campaigns': ['written-approval'],
        'details-on-the-fuqara-category': ['category-explained'],
        'details-on-the-masakin-category': ['explanation-of-fund-usage'],
        'details-on-the-amilin-alayha-category': ['category-explained'],
        'details-on-the-fi-ar-riqab-category': ['assurance-funds-properly-used'],
        'details-on-the-al-gharimin-category': ['category-explained'],
        'details-on-the-fi-sabilillah-category': ['explanation-of-fund-usage'],
        'details-on-the-ibn-as-sabil-category': ['category-explained']
    },

    'core-area-4': {
        'board-members-names-on-website': 'yes',
        'number-of-board-members': '3-or-more',
        'board-members-photos-on-website': 'yes',
        'leadership-team-names-on-website': 'yes',
        'leadership-photos-on-website': 'no',
        'minimum-3-board-members-at-arms-length': 'yes'
    }
};
