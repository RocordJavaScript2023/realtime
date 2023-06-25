import { Session, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-global";
import { authOptions } from "../../auth/[...nextauth]/route";
import { User } from "@prisma/client";
import { UserDTO } from "@/lib/types/dto/user-dto";

export async function GET(request: NextRequest): Promise<NextResponse> {

    const currentSession: Session | null = await getServerSession(authOptions);

    if (currentSession !== null && typeof currentSession !== 'undefined') {
        if (currentSession.user !== null && typeof currentSession.user !== 'undefined') {
            const userEmail: string = currentSession.user.email ?? "";
            const foundUser: User | null = await prisma.user.findUnique({
                where: { email: userEmail },
            });

            if (foundUser !== null && typeof foundUser !== 'undefined') {
                const mappedUserDTO: UserDTO = {
                    id: foundUser.id,
                    name: foundUser.name,
                    picture: foundUser.picture,
                    email: foundUser.email
                };

                return NextResponse.json({
                    status: "200-OK",
                    data: mappedUserDTO,
                }, {
                    status: 200,
                });
            }
        }

        return NextResponse.json({
            status: "404-Not-Found",
        }, {
            status: 404,
        });
    }

    return NextResponse.json({
        status: "500-Internal-Server-Error",
    }, {
        status: 500,
    })
}