
export type QuestionType = 'text' | 'radio' | 'date' | 'file' | 'paragraph' | 'number';

export type QuestionOption = {
    id: string;
    label: string;
    sortOrder: number;
}

export type Question = {
    id: string;
    code: string;
    label: string;
    type: QuestionType;
    required: boolean;
    scoreLogic: string | null;
    options: QuestionOption[];
    rubricItem: any | null;
}

export type FormDefinition = {
    id: string;
    title: string;
    version: number;
    countryCode: 'uk' | 'canada' | 'usa';
    scoreLogic: string | null;
    rubric: any;
    questions: Question[];
}
