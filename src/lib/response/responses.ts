import { NextResponse } from "next/server";

export function unauthorized(): NextResponse {
    return NextResponse.json({
        message: '401 - Unauthorized',
    }, {
        status: 401,
    });
}

export function notFound(): NextResponse {
    return NextResponse.json({
        message: '404 - Not Found',
    }, {
        status: 404,
    });
}