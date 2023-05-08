import { User } from "@prisma/client";
import { Mapper } from "./mapper.interface";
import { FrontendUser } from "@/lib/types/frontend-user.type";

export class FrontendMapper implements Mapper<User, FrontendUser> {

    mapToType(input: User): FrontendUser {
        return {
            id: input.id,
            name: input.name,
            picture: input.picture,
            email: input.email,
        };
    }
    
}