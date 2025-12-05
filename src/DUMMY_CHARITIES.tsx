import { SingleCharityType } from "./components/use-case/CharitiesPageComponent/kanban/KanbanView"
import AssignIcon from "./components/use-case/SingleCharityPageComponent/icons/AssignIcon"
import TestIcon from "./components/use-case/SingleCharityPageComponent/icons/TestIcon"

export const DUMMY_CHARITIES: SingleCharityType[] = [
    {
        id: "c1",
        charityTitle: "Books For Change",
        charityOwnerName: "Hamza Farid",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m1",
                name: "Ali Khan",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 2,
        auditsCompleted: 1,
        status: "pending-eligibility",
        category: "education",
    },
    {
        id: "c2",
        charityTitle: "Scholarship Aid",
        charityOwnerName: "Ayesha Khan",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [],
        comments: 1,
        auditsCompleted: 0,
        status: "unassigned",
        category: "local-relief",
    },
    {
        id: "c3",
        charityTitle: "Books For Change",
        charityOwnerName: "Hamza Farid",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m2",
                name: "Nimrah Shah",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 2,
        auditsCompleted: 1,
        status: "pending-eligibility",
        category: "education",
    },
    {
        id: "c4",
        charityTitle: "Scholarship Aid",
        charityOwnerName: "Ayesha Khan",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m3",
                name: "Fatima Noor",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 1,
        auditsCompleted: 0,
        status: "pending-eligibility",
        category: "education",
    },
    {
        id: "c5",
        charityTitle: "Books For Change",
        charityOwnerName: "Hamza Farid",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m1",
                name: "Ali Khan",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 2,
        auditsCompleted: 1,
        status: "pending-eligibility",
        category: "education",
    },
    {
        id: "c6",
        charityTitle: "Scholarship Aid",
        charityOwnerName: "Ayesha Khan",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m2",
                name: "Nimrah Shah",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 1,
        auditsCompleted: 0,
        status: "pending-eligibility",
        category: "education",
    },
    {
        id: "c7",
        charityTitle: "Books For Change",
        charityOwnerName: "Hamza Farid",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m4",
                name: "Usman Tariq",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 2,
        auditsCompleted: 1,
        status: "pending-eligibility",
        category: "international-relief",
    },
    {
        id: "c8",
        charityTitle: "Scholarship Aid",
        charityOwnerName: "Ayesha Khan",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m3",
                name: "Fatima Noor",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 1,
        auditsCompleted: 0,
        status: "pending-eligibility",
        category: "health-medical-aid",
    },
    {
        id: "c3-1",
        charityTitle: "Clean Water Project #1",
        charityOwnerName: "Bilal Hussain",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit.",
        members: [
            {
                id: "m1",
                name: "Ali Khan",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 0,
        auditsCompleted: 1,
        status: "open-to-review",
        category: "environment-sustainability",
        country: "uk",
        totalDuration: "3 months",
        website: "https://cleanwater1.example.org",
        isThisMuslimCharity: true,
        doTheyPayZakat: true,
    },
    {
        id: "c3-2",
        charityTitle: "Clean Water Project #2",
        charityOwnerName: "Bilal Hussain",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit.",
        members: [
            {
                id: "m2",
                name: "Nimrah Shah",
                profilePicture: null,
                role: "project-manager",
            },
            {
                id: "m4",
                name: "Usman Tariq",
                profilePicture: null,
                role: "finance-auditor",
            },
        ],
        comments: 1,
        auditsCompleted: 2,
        status: "open-to-review",
        category: "environment-sustainability",
        country: "usa",
        totalDuration: "6 months",
        website: "https://cleanwater2.example.org",
        isThisMuslimCharity: false,
        doTheyPayZakat: false,
    },
    {
        id: "c3-3",
        charityTitle: "Clean Water Project #3",
        charityOwnerName: "Bilal Hussain",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m3",
                name: "Fatima Noor",
                profilePicture: null,
                role: "finance-auditor",
            },
        ],
        comments: 2,
        auditsCompleted: 3,
        status: "open-to-review",
        category: "environment-sustainability",
        country: "ca",
        totalDuration: "4 months",
        website: "https://cleanwater3.example.org",
        isThisMuslimCharity: true,
        doTheyPayZakat: false,
    },
    {
        id: "c4",
        charityTitle: "Green Future",
        charityOwnerName: "Zainab Rauf",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m4",
                name: "Usman Tariq",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 0,
        auditsCompleted: 3,
        status: "pending-admin-review",
        category: "environment-sustainability",
        country: "uk",
        totalDuration: "2 months",
        website: "https://greenfuture.example.org",
        isThisMuslimCharity: false,
        doTheyPayZakat: false,
    },
    {
        id: "c5",
        charityTitle: "Shelter For All",
        charityOwnerName: "Imran Latif",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m1",
                name: "Ali Khan",
                profilePicture: null,
                role: "project-manager",
            },
            {
                id: "m2",
                name: "Nimrah Shah",
                profilePicture: null,
                role: "finance-auditor",
            },
            {
                id: "m3",
                name: "Fatima Noor",
                profilePicture: null,
                role: "zakat-auditor",
            },
        ],
        comments: 4,
        auditsCompleted: 4,
        status: "approved",
        category: "local-relief",
        country: "usa",
        totalDuration: "12 months",
        website: "https://shelterforall.example.org",
        isThisMuslimCharity: true,
        doTheyPayZakat: true,
    },
    {
        id: "c6",
        charityTitle: "Tech For Youth",
        charityOwnerName: "Shahid Iqbal",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m2",
                name: "Nimrah Shah",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 2,
        auditsCompleted: 2,
        status: "approved",
        category: "education",
        country: "ca",
        totalDuration: "8 months",
        website: "https://techforyouth.example.org",
        isThisMuslimCharity: false,
        doTheyPayZakat: false,
    },
    {
        id: "c7",
        charityTitle: "Food Security",
        charityOwnerName: "Rabia Malik",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m4",
                name: "Usman Tariq",
                profilePicture: null,
                role: "admin",
            },
        ],
        comments: 1,
        auditsCompleted: 1,
        status: "approved",
        category: "international-relief",
        country: "uk",
        totalDuration: "5 months",
        website: "https://foodsecurity.example.org",
        isThisMuslimCharity: true,
        doTheyPayZakat: false,
    },
    {
        id: "c8",
        charityTitle: "Health For All",
        charityOwnerName: "Adnan Malik",
        charityDesc:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit",
        members: [
            {
                id: "m3",
                name: "Fatima Noor",
                profilePicture: null,
                role: "project-manager",
            },
        ],
        comments: 6,
        auditsCompleted: 1,
        status: "ineligible",
        category: "health-medical-aid",
        country: "usa",
        totalDuration: "1 month",
        website: "https://healthforall.example.org",
        isThisMuslimCharity: false,
        doTheyPayZakat: false,
    },
]

// export const DUMMY_TASKS = {
//     'core-area-1': 'Perform Charity Status (Core Area 1) audit',
//     'core-area-2': 'Perform Financial Accountability Core Area 2 audit',
//     'core-area-3': 'Perform Zakat Assessment (Core Area 3) audit',
//     'core-area-4': 'Perform Governance & Leadership (Core Area 4) audit',
//     'eligibility': "Perform Eligibility Test",
//     "assign-project-manager": "Assign Project Manager",
// }

export type TaskIds = 'assign-project-manager' | 'eligibility' | 'core-area-1' | 'core-area-2' | 'core-area-3' | 'core-area-4';

export type TaskType = {
    id: TaskIds;
    title: string;
    icon: React.ReactNode;
}


export const DUMMY_TASKS: TaskType[] = [
    {
        id: "assign-project-manager",
        title: "Assign Project Manager",
        icon: <AssignIcon />
    },
    {
        id: 'eligibility',
        title: "Perform Eligibility Test",
        icon: <TestIcon />
    },
    {
        id: 'core-area-1',
        title: 'Perform Charity Status (Core Area 1) audit',
        icon: <TestIcon />
    },
    {
        id: 'core-area-2',
        title: 'Perform Financial Accountability (Core Area 2) audit',
        icon: <TestIcon />
    },
    {
        id: 'core-area-3',
        title: 'Perform Zakat Assessment (Core Area 3) audit',
        icon: <TestIcon />
    },
    {
        id: 'core-area-4',
        title: 'Perform Governance & Leadership (Core Area 4) audit',
        icon: <TestIcon />
    }
]