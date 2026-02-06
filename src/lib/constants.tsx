
import React from 'react';
import AssignIcon from "@/components/use-case/SingleCharityPageComponent/icons/AssignIcon";
import TestIcon from "@/components/use-case/SingleCharityPageComponent/icons/TestIcon";
import { TaskType } from "@/types/audits";

export const AUDIT_TASKS: TaskType[] = [
    {
        id: "assign-project-manager",
        title: "Assign Project Manager",
        icon: <AssignIcon />
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
];
