"use client";

import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";

export default function SessionRedirect({ statusToRedirectOn, pageToRedirectTo }: { statusToRedirectOn: 'authenticated' | 'unauthenticated' | 'loading', pageToRedirectTo: string}) {
    const {data: session, status } = useSession();
    const router: AppRouterInstance = useRouter();

    if (status === statusToRedirectOn) {
        router.push(pageToRedirectTo);
    }

    return(<></>);
}