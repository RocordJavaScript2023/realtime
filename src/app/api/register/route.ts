import { prisma } from "@/lib/db/prisma-global";
import {hash, hashSync} from "bcryptjs";
import {NextRequest, NextResponse} from "next/server";
import {Server, User} from "@prisma/client";





export interface CreateUserRequestDTO {
  name: string;
  picture: string;
  email: string;
  password: string;


}


export async function POST(req: NextRequest): Promise<NextResponse> {

  /*request = {
     name: 'someName',
     picture: 'some.path.to/picture',
     email: 'some@email.de',
     password: 'lsdhavlsdhf;lashdfp',
    }*/


  const userFromBody: CreateUserRequestDTO = await (await req.json() as CreateUserRequestDTO);

  // Wurde user wirklich mitgeschickt?
  if (userFromBody !== null && typeof userFromBody !== 'undefined'){
    // hat der User ein Bild?
    let extractedPicturePath: string = '';
    // wenn kein Bild --> Robohash
    if (typeof userFromBody.picture === 'undefined' || userFromBody.picture === '' || userFromBody.picture === null) {
      extractedPicturePath = `https://robohash.org/${userFromBody.name}`;
    } else {
      extractedPicturePath = userFromBody.picture;
    }

    // user anlegen.
    const newUserToCreate: { password: string; name: string; picture: string; email: string } = {
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
            id: defaultServer.id ?? "0",
          },
        },
      },
    });
    // EDIT!
    if (createdUser !== null) {
      return NextResponse.json({
        status: "201-CREATED",
        data: createdUser,
      }, {
        status: 201
      });
    }
  }

  // default Response
  return NextResponse.json({
    status: "500-Internal-Server-Error",
  }, {
    status: 500
  });

  }

