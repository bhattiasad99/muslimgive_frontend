import React from "react";
import LinkComponent from "@/components/common/LinkComponent";
import { Button } from "@/components/ui/button";

const NotAuthorized = () => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="max-w-md text-center flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">Not Authorized</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    You do not have permission to view this page.
                </p>
                <div className="flex justify-center gap-2 mt-4">
                    <LinkComponent to="/charities">
                        <Button variant="outline">Back to Charities</Button>
                    </LinkComponent>
                </div>
            </div>
        </div>
    );
};

export default NotAuthorized;
