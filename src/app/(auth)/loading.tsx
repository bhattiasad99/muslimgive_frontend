import AuthSkeleton from "@/components/use-case/AuthSkeleton";

export default function Loading() {
    // This renders in the content area while child segments fetch.
    return <AuthSkeleton />;
}
