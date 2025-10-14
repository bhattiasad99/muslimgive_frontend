import React from 'react'

const AuthLayoutUI = () => {
    return (
        <main className='bg-background flex justify-center items-center min-h-screen'>
            <div className="bg-white p-4 md:p-8 rounded-lg border-[rgba(148,148,148, 0.1)] flex flex-col items-center gap-6 max-w-[528px] min-w-[300px] w-[40vw]" >
                {/* Logo */}
                <div className="h-10 w-64 rounded-xl bg-muted animate-pulse" />

                {/* Heading and subheading */}
                <div className="flex w-full flex-col items-center gap-2">
                    <div className="h-7 w-1/2 rounded-lg bg-muted animate-pulse" />
                    <div className="h-4 w-2/3 rounded-lg bg-muted animate-pulse" />
                </div>

                {/* Form fields */}
                <div className="w-full space-y-4">
                    {/* Label */}
                    <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                    {/* Input */}
                    <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />

                    {/* Optional second field placeholder */}
                    <div className="h-4 w-28 rounded bg-muted animate-pulse mt-4" />
                    <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
                </div>

                {/* Submit button */}
                <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />

                {/* Footer link */}
                <div className="h-4 w-40 rounded bg-muted animate-pulse" />
            </div>
        </main>
    )
}

export default AuthLayoutUI