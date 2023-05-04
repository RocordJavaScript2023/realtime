import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import type { FrontendUser } from "@/lib/types/frontend-user.type";

export default async function Profile() {
    const session = await getServerSession(authOptions);

    if(!session) {
        redirect('/api/auth/signin');
    }

    
}