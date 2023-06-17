import { PrismaClient, Room } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const rooms: Room[] = await prisma.room.findMany();
    return NextResponse.json({
      status: 200,
      data: rooms
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      data: "Internal Server Error"
    })
  }
}