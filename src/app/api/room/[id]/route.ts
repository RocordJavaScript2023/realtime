import { Room } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-global";
import { RoomDTO } from "@/lib/types/dto/room-dto";

export async function GET(request: NextRequest, { params }: { params: { roomId: string }}): Promise<NextResponse> {

    if(params.roomId !== '') {

        let returnRoom: RoomDTO | null = null;
        const foundRoom: Room | null = await prisma.room.findUnique({
            where: { id: params.roomId },
        });

        if (foundRoom !== null && typeof foundRoom !== 'undefined') {
            returnRoom = {
                id: foundRoom.id,
                serverId: foundRoom.serverId,
                roomName: foundRoom.roomName
            };

            return NextResponse.json({
                status: "200-OK",
                data: returnRoom,
            });
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
        status: 204
    });
}