import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { Session, getServerSession } from "next-auth";
import { NextURL } from "next/dist/server/web/next-url";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { JWT, getToken } from "next-auth/jwt";
import { MiddleWareDriver } from "./server/middleware/middleware-driver";
import { defaultNextResponse } from "./server/middleware/handler/functions/handler-functions";
import { NextHandlerFactory } from "./server/middleware/handler/factory/next-handler-factory";
import { Chainable } from "./server/middleware/handler/chainable.interface";
import { unauthorized } from "./lib/response/responses";
import { User } from "@prisma/client";
import { FrontendUser } from "./lib/types/frontend-user.type";
import { prisma } from "./lib/db/prisma-global";

export async function middleware(request: NextRequest) {
  const defaultResponse: NextResponse = defaultNextResponse();

  const handlerFactory: NextHandlerFactory = new NextHandlerFactory();

  const apiHandler: Chainable<NextRequest, NextResponse> = handlerFactory
    .create()
    .setPathComponent("/api/")
    .setHandle(async (req: NextRequest) => {
      const userSession: Session | null = await getServerSession(authOptions);
      const userToken: JWT | null = await getToken({ req: request });

      // User has a Session at least
      if (userSession !== null && typeof userSession !== "undefined") {
        const sessionUser: FrontendUser | undefined | null =
          userSession.user as FrontendUser;

        if (sessionUser !== null && typeof sessionUser !== "undefined") {
          // check if user actually exists in database.
          const backendUser: User | null = await prisma.user.findUnique({
            where: {
              email: sessionUser.email,
            },
          });

          if (backendUser !== null && typeof backendUser !== "undefined") {

            // Next, check if the JWT Token is present.
            if (userToken !== null && typeof userToken !== "undefined") {
              // Let the request go through to the API - Endpoint.
              return NextResponse.next();
            }
          }
        }
      }

      // If no authentication Information is present,
      // return the default unauthorized response.
      return unauthorized();
    });

  const basicHandler: Chainable<NextRequest, NextResponse> = handlerFactory
    .create()
    .setPathComponent("/")
    .setHandle(async (req: NextRequest) => {
      const userSession: Session | null = await getServerSession(authOptions);

      // only check if the User has a session.
      if (userSession !== null && typeof userSession !== "undefined") {
        return NextResponse.next();
      }
      return unauthorized();
    });

  const middleWareDriver: MiddleWareDriver<NextRequest, NextResponse> =
    new MiddleWareDriver<NextRequest, NextResponse>(defaultResponse);

  middleWareDriver.appendToChain(apiHandler).appendToChain(basicHandler);

  return middleWareDriver.handleRequest(request);
}

export const config = {
};
