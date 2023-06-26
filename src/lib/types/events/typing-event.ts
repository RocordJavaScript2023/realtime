import { RoomDTO } from "../dto/room-dto";
import { UserDTO } from "../dto/user-dto";

export const TYPING_EVENT: string = 'typing-event';

export interface TypingEvent {
    user: UserDTO;
    room: RoomDTO;
}