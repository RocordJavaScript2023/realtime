import { RoomDTO } from "@/lib/types/dto/room-dto";
import { PrismaClient, Room } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function mapToRoomDTOArray(rooms: Room[]): RoomDTO[] {
  let returnDTOs: RoomDTO[] = new Array<RoomDTO>();

  for (const room of rooms) {
    const newRoomDTO: RoomDTO = {
      id: room.id,
      serverId: room.serverId,
      roomName: room.roomName,
    };

    returnDTOs.push(newRoomDTO);
  }
  
  return returnDTOs;
}

export async function GET(req: NextRequest) {
  try {
    const rooms: Room[] = await prisma.room.findMany();
    const mappedRooms: RoomDTO[] = mapToRoomDTOArray(rooms);
    return NextResponse.json({
      status: 200,
      data: mappedRooms
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      data: "Internal Server Error"
    })
  }
}