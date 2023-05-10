import { NextResponse } from "next/server";


/**
 * Default Response if an API Endpoint has been called
 * without a valid user Session
 * @returns NextResponse - A JSON Response with the status code 401 in the form: { message: '401 - Unauthorized' }
 */
export function unauthorized(): NextResponse {
    return NextResponse.json({
        message: '401 - Unauthorized',
    }, {
        status: 401,
    });
}


/**
 * Default Response if the requested Resource could not be found.
 * @returns NextResponse - A JSON Response with the status code 404 in the form: { message: '404 - Not Found' }
 */
export function notFound(): NextResponse {
    return NextResponse.json({
        message: '404 - Not Found',
    }, {
        status: 404,
    });
}