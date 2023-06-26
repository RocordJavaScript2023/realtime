import { RoomDTO } from "../dto/room-dto";
import { UserDTO } from "../dto/user-dto";

export const LEAVE_ROOM_EVENT: string = 'leave-room-event';
export const LEFT_ROOM_EVENT: string = 'left-room-event';

export interface LeaveRoomEvent {
    roomToLeave: RoomDTO;
    user: UserDTO;
}

export interface LeftRoomEvent {
    user: UserDTO;
    time: string;
}