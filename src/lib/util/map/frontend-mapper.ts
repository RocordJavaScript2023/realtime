import { User } from "@prisma/client";
import { Mapper } from "./mapper.interface";
import { UserDTO } from "@/lib/types/dto/user-dto";


export class FrontendMapper implements Mapper<User, UserDTO> {

    mapToType(input: User): UserDTO {
        return {
            id: input.id,
            name: input.name,
            picture: input.picture,
            email: input.email,
        };
    }
    
}