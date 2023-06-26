import { RoomDTO } from "../dto/room-dto";
import { UserDTO } from "../dto/user-dto";

export const JOIN_ROOM: string = 'join-room-event';
export const JOINED_ROOM: string = 'joined-room-event';

export interface JoinRoomEvent {
    roomToJoin: RoomDTO;
    user: UserDTO;
}

export interface JoinedRoomEvent {
    user: UserDTO;
}