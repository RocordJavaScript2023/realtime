import { User } from "@prisma/client";
import { Mapper } from "./mapper.interface";
import { FrontendUser } from "@/lib/types/frontend-user.type";
import { hashSync } from "bcryptjs";


export class FrontendMapper implements Mapper<User, FrontendUser> {

    mapToType(input: User): FrontendUser {
        return {
            id: hashSync(input.id, 12),
            name: input.name,
            picture: input.picture,
            email: input.email,
        };
    }
    
}