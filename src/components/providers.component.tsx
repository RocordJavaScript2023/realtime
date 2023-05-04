"use client";

import { SessionProvider } from "next-auth/react";

/**
 * This Component is vital for
 * managing UserSession State.
 * 
 * By wrapping each page within this component
 * our other components gain access to the 
 * `useSession()` - Hook.
 * 
 * This allows us to track the session-state of a user
 * and extract user-data from the session-state. 
 * 
 * We can also check authorizations of a user this way.
 * 
 * It should only ever be imported and used in the topmost 
 * Layout file (src/app/layout.tsx)
 * 
 * That way it will be included in all subsequent pages.
 * 
 * This is a Client-Side Component ("use-client")
 * 
 * @param children: { children: React.ReactNode } The child elements of this Node
 * @returns JSX.Element
 */
export const NextAuthProvider = ({children}: { children: React.ReactNode}) => {

    return (
        <SessionProvider>
            { children }
        </SessionProvider>
    );
};