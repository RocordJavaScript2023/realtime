import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-global";
import { Message, Room, User } from "@prisma/client";
import { UserDTO } from "@/lib/types/dto/user-dto";
import MessageDTO from "@/lib/types/dto/message-dto";
import { RoomDTO } from "@/lib/types/dto/room-dto";

export async function GET(request: NextRequest, {params}: {params: { mailString: string}}): Promise<NextResponse> {

    if (params.mailString !== '') {
        
        const foundUser: User | null = await prisma.user.findUnique({
            where: { email: params.mailString},
        });

        if (foundUser !== null && typeof foundUser !== 'undefined') {


            const foundMessages: Message[] | null = await prisma.message.findMany({
                where: { userId: foundUser.id },
            });
            let mappedMessages: MessageDTO[] = new Array<MessageDTO>();

            const userDTO: UserDTO = {
                id: foundUser.id,
                email: foundUser.email,
                picture: foundUser.picture,
                name: foundUser.name,
            };
 

            for (const element of foundMessages) {
                const usedRoom: Room | null = await prisma.room.findUnique({
                    where: { id: element.roomId }
                });
                const roomDTO: RoomDTO = {
                    id: usedRoom?.id ?? "UNKNOWN",
                    roomName: usedRoom?.roomName ?? "UNKNOWN",
                    serverId: usedRoom?.serverId ?? "UNKNOWN",
                };
                const mappedMessage: MessageDTO = {
                    user:  userDTO,
                    createdAt: element.createdAt,
                    content: element.content,
                    roomUsed: roomDTO,
                };

                mappedMessages.push(mappedMessage);
            }

            return NextResponse.json({
                status: "200-OK",
                data: mappedMessages,
            });
        }

        return NextResponse.json({
            status: "404-Not-Found",
        }, {
            status: 404,
        });
    }

    return NextResponse.json({
        status: "204-No-Content"
    }, {
        status: 204
    });
}