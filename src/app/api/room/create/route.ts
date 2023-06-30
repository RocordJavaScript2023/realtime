import { prisma } from "@/lib/db/prisma-global";
import { RoomDTO } from "@/lib/types/dto/room-dto";
import { CreateRoomRequest } from "@/lib/types/request/create-room-request";
import { Room, Server } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * Instead of GET - which is statically evaluated
 * POST will be dynamically evaluated.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestBody: CreateRoomRequest | null =
    (await request.json()) as CreateRoomRequest;

  if (requestBody !== null && typeof requestBody !== "undefined") {
    // first check if a room with same name already exists.
    const alreadyExistingRoom: Room | null = await prisma.room.findUnique({
      where: {
        roomName: requestBody.roomToCreate.roomName,
      },
    });

    // If no room exists, then we are free to proceed with
    // persisting a new Room.
    if (alreadyExistingRoom === null) {
      // persist the new room and link it to the server
      const newlyCreatedRoom: Room = await prisma.room.create({
        data: {
          roomName: requestBody.roomToCreate.roomName,
          server: {
            connect: {
              id: requestBody.roomToCreate.serverId,
            },
          },
        },
      });

      // return the newly created Room to the User
      const roomDTO: RoomDTO = {
        id: newlyCreatedRoom.id,
        serverId: newlyCreatedRoom.serverId,
        roomName: newlyCreatedRoom.roomName,
      };

      return NextResponse.json(
        {
          status: "201-Created",
          data: roomDTO,
        },
        {
          status: 201,
        }
      );
    }
  }

  return NextResponse.json(
    {
      status: "400-Bad-Request",
    },
    {
      status: 400,
    }
  );
}
