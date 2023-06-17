import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    try {
      const users: User[] = await prisma.user.findMany();
      return NextResponse.json({
        status: 200,
        data: users
      })
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        status: 500,
        data: "Internal Server Error"
      })
    }
  } else {
    return NextResponse.json({
      status: 405,
      data: "Method not allowed",
    })
  }
}
