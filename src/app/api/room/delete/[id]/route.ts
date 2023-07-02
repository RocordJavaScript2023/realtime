import { prisma } from "@/lib/db/prisma-global";
import { Room } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export default async function DELETE(request: NextRequest, { params }: { params: { id: string }}): Promise<NextResponse> {

    if (params.id !== null && typeof params.id !== 'undefined' && params.id !== '') {
        const foundRoom: Room | null = await prisma.room.findUnique({
            where: { id: params.id }
        });

        if (foundRoom !== null) {
            // delete the room.
            const roomDeleted: Room = await prisma.room.delete({
                where: { id: foundRoom.id }
            });

            return NextResponse.json({
                status: "200-OK",
                data: roomDeleted,
            }, {
                status: 200,
            });
        }
    }

    return NextResponse.json({
        status: "400-Bad-Request",
    }, {
        status: 400,
    });
}