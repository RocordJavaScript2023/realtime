import { PrismaClient, Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const messages: Message[] = await prisma.message.findMany();
    return NextResponse.json({
      status: 200,
      data: messages
    })
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      data: "Internal Server Error"
    })
  }
}