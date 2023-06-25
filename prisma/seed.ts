import { Message, PrismaClient, Room, User, Server } from "@prisma/client";
import { hash } from "bcryptjs";


const prisma = new PrismaClient();

async function main() {
    

    const defaultServer = {
        serverName: "defaultServer",
    }

    const createServer: Server = await prisma.server.create({
        data: {
            ...defaultServer,
        },
    });

    const defaultRoom = {
        roomName: "Default Room",
    };

    const createRoom: Room = await prisma.room.create({
        data: {
            ...defaultRoom,
            server: {
                connect: {
                    id: createServer.id,
                },
            },
        },
    });

    const otherDefaultRoom = {
        roomName: "Default Room 2",
    }

    const createRoom2 = await prisma.room.create({
        data: {
            ...otherDefaultRoom,
            server: {
                connect: {
                    id: createServer.id,
                }
            }
        }
    })

    const password = await hash("password123", 12);

    const defaultAdmin = {
        name: "defaultAdmin",
        email: "admin@admin.de",
        password,
        picture: (process.env.ROBOHASH_BASE_URL ?? "https://robohash.org/") + "admin",
        emailVerified: new Date(),
    }

    const createAdmin: User = await prisma.user.upsert({
        where: { email: defaultAdmin.email },
        update: {
            ...defaultAdmin,
            servers: {
                connect: {
                    id: createServer.id,
                }
            }
        },
        create: {
            ...defaultAdmin,
            servers: {
                connect: {
                    id: createServer.id,
                }
            }
        }
    });

    const firstMessage = {
        createdAt: new Date(),
        updatedAt: new Date(),
        content: "First Message: Default Admin says Hi!",
    };

    const createFirstMessage: Message = await prisma.message.create({
        data: {
            ...firstMessage,
            user: {
                connect: {
                    id: createAdmin.id,
                }
            },
            room: {
                connect: {
                    id: createRoom.id,
                },
            },
        },
    });
}

main()
.then(() => prisma.$disconnect())
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})