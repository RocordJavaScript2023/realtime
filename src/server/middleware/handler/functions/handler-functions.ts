import { unauthorized } from "@/lib/response/responses";
import { HandlerFunction } from "@/lib/types/handler-function.type";
import { NextRequest, NextResponse } from "next/server";


export const defaultNextResponse: HandlerFunction<NextRequest, NextResponse> = async function (request?: NextRequest): Promise<NextResponse> {
    return unauthorized();
}
