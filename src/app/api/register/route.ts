// IF YOU COPY MY CODE 1:1 FROM DISCORD, AT LEAST TRY TO UNDERSTAND IT GOD-FUCKING-DAMMIT!
// ALSO, FORMAT YOUR FILES!
import { prisma } from "@/lib/db/prisma-global";
import { hashSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { Server, User } from "@prisma/client";
import { CreateUserRequestDTO } from "@/lib/types/request/create-user-request";

// I TOLD YOU TO REFACTOR THIS TYPE TO IT'S OWN FILE!
// export interface CreateUserRequestDTO {
//   name: string;
//   picture: string;
//   email: string;
//   password: string;
// }

export async function POST(req: NextRequest): Promise<NextResponse> {
  /*request = {
     name: 'someName',
     picture: 'some.path.to/picture',
     email: 'some@email.de',
     password: 'lsdhavlsdhf;lashdfp',
    }*/

  const userFromBody: CreateUserRequestDTO =
    (await req.json()) as CreateUserRequestDTO;

  // Wurde user wirklich mitgeschickt?
  if (userFromBody !== null && typeof userFromBody !== "undefined") {
    // hat der User ein Bild?
    let extractedPicturePath: string = "";
    // wenn kein Bild --> Robohash
    if (
      typeof userFromBody.picture === "undefined" ||
      userFromBody.picture === "" ||
      userFromBody.picture === null
    ) {
      extractedPicturePath = `https://robohash.org/${userFromBody.name}`;
    } else {
      extractedPicturePath = userFromBody.picture;
    }

    // user anlegen.
    const newUserToCreate: {
      password: string;
      name: string;
      picture: string;
      email: string;
    } = {
      name: userFromBody.name,
      picture: extractedPicturePath,
      email: userFromBody.email,
      password: userFromBody.password,
    };
    // default Server extrahieren
    const defaultServer: Server | null = await prisma.server.findFirst();

    const user: User = await prisma.user.create({
      data: {
        name: newUserToCreate.name,
        picture: extractedPicturePath,
        email: userFromBody.email,
        password: hashSync(newUserToCreate.password), // no salt
        emailVerified: new Date(),
        servers: {
          // server verlinken
          connect: {
            id: defaultServer?.id ?? "0",
          },
        },
      },
    });
    // EDIT!
    if (user !== null) {
      return NextResponse.json(
        {
          status: "201-CREATED",
          data: newUserToCreate,
        },
        {
          status: 201,
        }
      );
    }
  }

  // default Response
  return NextResponse.json(
    {
      status: "500-Internal-Server-Error",
    },
    {
      status: 500,
    }
  );
}
