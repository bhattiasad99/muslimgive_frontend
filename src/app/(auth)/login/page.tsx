// optional: ensure this page never gets statically prerendered
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import LoginPageComponent from '@/components/use-case/LoginPageComponent';

type Search = { continue?: string };

export default async function Login({ searchParams }: { searchParams: Promise<Search> }) {
    const resolvedSearchParams = await searchParams;
    const cont = typeof resolvedSearchParams.continue === 'string' ? resolvedSearchParams.continue : '/';
    // small open-redirect hardening: allow only internal paths
    const safe = cont.startsWith('/') && !cont.startsWith('//') ? cont : '/';
    return <LoginPageComponent continueTo={safe} />;
}
