import LinkComponent from "@/components/common/LinkComponent";
import { Button } from "@/components/ui/button";

// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
    return (
        <main className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="max-w-md text-center flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">Unauthorized</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    You don&apos;t have permission to view this page.
                </p>
                <LinkComponent to="/charities">
                    <Button>Back to home</Button>
                </LinkComponent>
            </div>
        </main>
    );
}
