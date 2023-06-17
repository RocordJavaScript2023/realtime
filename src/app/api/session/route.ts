import { PrismaClient, Session } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const sessions: Session[] = await prisma.session.findMany();
    return NextResponse.json({
      status: 200,
      data: sessions
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      data: "Internal Server Error"
    })
  }
}