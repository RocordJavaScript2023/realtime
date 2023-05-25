import { unauthorized } from "@/lib/response/responses";
import { NextRequest, NextResponse } from "next/server";

export function defaultNextResponse(request?: NextRequest): NextResponse {
    return unauthorized();
}