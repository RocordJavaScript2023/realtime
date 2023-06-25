import { RoomDTO } from "./room-dto";
import { UserDTO } from "./user-dto";

export default interface MessageDTO {
    user: UserDTO;
    createdAt: Date;
    content: string;
    roomUsed: RoomDTO; 
}