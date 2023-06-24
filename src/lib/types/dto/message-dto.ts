import { UserDTO } from "./user-dto";

export default interface MessageDTO {
    user: UserDTO | null;
    createdAt: Date | null;
    content: string | null;
    roomUsed?: string | null; 
}