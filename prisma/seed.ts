import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";


const prisma = new PrismaClient();

async function main() {
    const password = await hash("password123", 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            name: "admin",
            email: "admin@admin.com",
            password,
            picture: "",
        },
    });
    // const message = await prisma.message.upsert(
    //     {
    //         where: {id: "1"},
    //         update: {},
    //         create: {

    //         }
    //     }
    // );
}

main()
.then(() => prisma.$disconnect())
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})
