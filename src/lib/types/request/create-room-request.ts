import { RoomDTO } from "../dto/room-dto";
import { UserDTO } from "../dto/user-dto";

export interface CreateRoomRequest {
    user: UserDTO;
    roomToCreate: RoomDTO;
}