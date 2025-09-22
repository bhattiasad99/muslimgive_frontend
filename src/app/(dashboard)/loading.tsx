import DashboardSkeleton from "@/components/use-case/DashboardSkeleton";

export default function Loading() {
    // This renders in the content area while child segments fetch.
    return <DashboardSkeleton />;
}
