// app/(dashboard)/template.tsx
import DashboardSkeleton from '@/components/use-case/DashboardSkeleton';
import { Suspense } from 'react';

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
    return <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>;
}