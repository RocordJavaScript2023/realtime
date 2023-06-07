import {NextResponse} from "next/server";
import {NextRequest} from "next/server";
import {Session, getServerSession} from "next-auth";
import {NextURL} from "next/dist/server/web/next-url";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {JWT, getToken} from "next-auth/jwt";
import {MiddleWareDriver} from "./server/middleware/middleware-driver";
import {defaultNextResponse} from "./server/middleware/handler/functions/handler-functions";
import {NextHandlerFactory} from "./server/middleware/handler/factory/next-handler-factory";
import {Chainable} from "./server/middleware/handler/chainable.interface";

export async function middleware(request: NextRequest) {

    const defaultResponse: NextResponse = defaultNextResponse();

    const handlerFactory: NextHandlerFactory = new NextHandlerFactory();

    const apiHandler: Chainable<NextRequest, NextResponse> = handlerFactory
        .create()
        .setPathComponent("/api")
        .setHandle(async (req: NextRequest) => {
            const userSession: Session | null = await getServerSession(authOptions);
            const userToken: JWT | null = await getToken({req: request});

            return NextResponse.next();
        });

    const middleWareDriver: MiddleWareDriver<NextRequest, NextResponse> =
        new MiddleWareDriver<NextRequest, NextResponse>(defaultResponse);
    return NextResponse.redirect(new NextURL("/login"));
}

export const config = {
    matcher: [],
};
