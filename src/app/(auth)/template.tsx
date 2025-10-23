// app/(dashboard)/template.tsx
import AuthSkeleton from '@/components/use-case/AuthSkeleton';
import { Suspense } from 'react';

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
    return <Suspense fallback={<AuthSkeleton />}>{children}</Suspense>;
}