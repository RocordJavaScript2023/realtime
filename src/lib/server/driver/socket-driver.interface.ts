import { JoinRoomEvent } from "@/lib/types/events/join-room-event";
import { LeaveRoomEvent } from "@/lib/types/events/leave-room-event";
import { MessageEvent } from "@/lib/types/events/message-event";
import * as socketio from "socket.io";

export interface SocketDriverInterface<InputType, OutputType> {

    configureEventHandling(input: InputType): OutputType;

    handleConnectEvent(socket: socketio.Socket): void;

    handleDisconnectEvent(socket: socketio.Socket): void;

    handleIncomingMessageEvent(event: MessageEvent, socket: socketio.Socket): void;

    handleJoinRoomEvent(event: JoinRoomEvent, socket: socketio.Socket): void;

    handleLeaveRoomEvent(event: LeaveRoomEvent, socket: socketio.Socket): void;
}