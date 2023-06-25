import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-global";
import { Message, User } from "@prisma/client";
import { UserDTO } from "@/lib/types/dto/user-dto";
import { RoomDTO } from "@/lib/types/dto/room-dto";
import MessageDTO from "@/lib/types/dto/message-dto";
import { hashSync } from "bcryptjs";

export async function GET(request: NextRequest, { params }: { params: { roomId: string}}): Promise<NextResponse> {

    if (params.roomId !== '') {
        const returnMessages: MessageDTO[] = new Array<MessageDTO>();
        const foundMessages: Message[] | null = await prisma.message.findMany({
            where: { id: params.roomId}
        });

        if (foundMessages !== null && typeof foundMessages !== 'undefined' && foundMessages.length !== 0) {
            for (const element of foundMessages) {

                let userDTO: UserDTO | null = null;
    
                const associatedUser: User | null = await prisma.user.findUnique(
                    {
                        where: { id: element.userId },
                    },
                );
    
                if (associatedUser !== null && typeof associatedUser !== 'undefined') {
                    userDTO = {
                        id: hashSync(associatedUser.id),
                        name: associatedUser.name,
                        picture: associatedUser.picture,
                        email: associatedUser.email,
                    };
                }
    
                const messageToAppend: MessageDTO = {
                    user: userDTO,
                    createdAt: element.createdAt,
                    content: element.content,
                };
    
                returnMessages.push(messageToAppend);
            }

            return NextResponse.json({
                status: "200-OK",
                data: returnMessages,
            })
        }

        return NextResponse.json({
            status: "404-Not-Found",
        }, {
            status: 404,
        });
    }

    return NextResponse.json({
        status: "204-No-Content",
    }, {
        status: 204,
    });
}