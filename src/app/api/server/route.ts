import { PrismaClient, Server } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const servers: Server[] = await prisma.server.findMany();
    return NextResponse.json({
      status: 200,
      data: servers
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      data: "Internal Server Error"
    })
  }
}