// optional: ensure this page never gets statically prerendered
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import LoginPageComponent from '@/components/use-case/LoginPageComponent';

type Search = { continue?: string };

export default function Page({ searchParams }: { searchParams: Search }) {
    const cont = typeof searchParams.continue === 'string' ? searchParams.continue : '/';
    // small open-redirect hardening: allow only internal paths
    const safe = cont.startsWith('/') && !cont.startsWith('//') ? cont : '/';
    return <LoginPageComponent continueTo={safe} />;
}

