import { prisma } from "@/lib/db/prisma-global";
import MessageDTO from "@/lib/types/dto/message-dto";
import { RoomDTO } from "@/lib/types/dto/room-dto";
import { UserDTO } from "@/lib/types/dto/user-dto";
import { Message, Room, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { name: string }}): Promise<NextResponse> {

    const roomName: string = params.name.replaceAll('%20', ' ');

    if (roomName !== '') {
        const returnMessages: MessageDTO[] = new Array<MessageDTO>();
        const foundMessages: Message[] | null = await prisma.message.findMany({
            where: {
                room: {
                    roomName: roomName,
                }
            }
        });

        if (foundMessages !== null && typeof foundMessages !== 'undefined' && foundMessages.length !== 0) {
            for (const element of foundMessages) {

                let userDTO: UserDTO | null = null;

                const associatedUser: User | null = await prisma.user.findUnique({
                    where: {
                        id: element.userId,
                    }
                });

                if (associatedUser !== null && typeof associatedUser !== 'undefined') {
                    userDTO = {
                        id: associatedUser.id,
                        name: associatedUser.name,
                        picture: associatedUser.picture,
                        email: associatedUser.email,
                    };
                }

                let roomDTO: RoomDTO | null = null;

                const roomUsed: Room | null = await prisma.room.findUnique({
                    where: {
                        id: element.roomId,
                    },
                });

                if (roomUsed !== null && typeof roomUsed !== 'undefined') {
                    roomDTO = {
                        id: roomUsed.id,
                        serverId: roomUsed.serverId,
                        roomName: roomUsed.roomName,
                    };
                }

                const messageToAppend: MessageDTO = {
                    user: userDTO ?? {
                        id: 'UNKNOWN',
                        name: 'UNKNOWN',
                        email: 'UNKNOWN',
                        picture: 'UNKNOWN'
                    },
                    createdAt: element.createdAt,
                    content: element.content,
                    roomUsed: roomDTO ?? {
                        id: 'UNKNOWN',
                        serverId: 'UNKNOWN',
                        roomName: 'UNKNOWN'
                    },
                };
    
                returnMessages.push(messageToAppend);
            }

            return NextResponse.json({
                status: "200-OK",
                data: returnMessages
            }, {
                status: 200,
            })
        }
    }


    return NextResponse.json({
        status: "404-Not-Found",
    }, {
        status: 404,
    })
}