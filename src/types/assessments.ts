import React from 'react';

export type TaskIds = 'assign-project-manager' | 'core-area-1' | 'core-area-2' | 'core-area-3' | 'core-area-4';

export type TaskType = {
    id: TaskIds;
    title: string;
    icon: React.ReactNode;
}
