import { SocketDriverInterface } from "@/lib/server/driver/socket-driver.interface";
import { JOINED_ROOM, JOIN_ROOM, JoinRoomEvent, JoinedRoomEvent } from "@/lib/types/events/join-room-event";
import { LEAVE_ROOM_EVENT, LEFT_ROOM_EVENT, LeaveRoomEvent, LeftRoomEvent } from "@/lib/types/events/leave-room-event";
import { MESSAGE_FROM_SERVER_EVENT, MESSAGE_FROM_CLIENT_EVENT, MessageEvent } from "@/lib/types/events/message-event";
import * as socketio from 'socket.io';
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { prisma } from "@/lib/db/prisma-global";
import { CONNECTION_EVENT } from "@/lib/types/events/connection-event";
import MessageDTO from "@/lib/types/dto/message-dto";
import { Message, User } from "@prisma/client";
import { UserDTO } from "@/lib/types/dto/user-dto";
import { RoomDTO } from "@/lib/types/dto/room-dto";

export const CONNECT_EVENT: string = 'connect';
export const DISCONNECT_EVENT: string = 'disconnect';

export class SocketDriver implements SocketDriverInterface<socketio.Server, Promise<socketio.Server>> {

    async handleConnectEvent(socket: socketio.Socket): Promise<void> {
        console.log(`a client connected.`);

        socket.emit(CONNECTION_EVENT, {
            connectionTime: new Date().toISOString(),
            messageContent: `Connected to session: ${socket.id}`,
        });

        socket.on(MESSAGE_FROM_CLIENT_EVENT, async (data: MessageEvent) => await this.handleIncomingMessageEvent(data, socket)); 
        socket.on(JOIN_ROOM, async (data: JoinRoomEvent) => await this.handleJoinRoomEvent(data, socket));
        socket.on(LEAVE_ROOM_EVENT, async (data: LeaveRoomEvent) => await this.handleLeaveRoomEvent(data, socket));
        socket.on(DISCONNECT_EVENT, async () => await this.handleDisconnectEvent(socket));
    }
    async handleDisconnectEvent(socket: socketio.Socket): Promise<void> {
        console.log('a client disconnected');
        console.log(`terminated session: ${socket.id}`);
    }

    async handleIncomingMessageEvent(event: MessageEvent, socket: socketio.Socket): Promise<void> {
        
        // first: persist the new Message
        const messageToPersist = {
            createdAt: event.message.createdAt ?? new Date(),
            updatedAt: new Date(),
            content: event.message.content ?? 'NO CONTENT',
        }

        const userInMessage: UserDTO = event.message.user;
        const roomInMessage: RoomDTO = event.message.roomUsed;

        const persistedMessage: Message = await prisma.message.create({
            data: {
                ...messageToPersist,
                user: {
                    connect: {
                        id: userInMessage.id,
                    },
                },
                room: {
                    connect: {
                        id: roomInMessage.id,
                    }
                }
            }
        });

        console.log(persistedMessage);

        // after the message has been persisted: Emit the message back out to all 
        // clients that are connected to the same room.
        socket.to(roomInMessage.roomName).emit(MESSAGE_FROM_SERVER_EVENT, event);
    }

    async handleJoinRoomEvent(event: JoinRoomEvent, socket: socketio.Socket): Promise<void> {
        socket.join(event.roomToJoin.roomName);
        const joinedRoomEvent: JoinedRoomEvent = {
            user: event.user,
        }
        socket.to(event.roomToJoin.roomName).emit(JOINED_ROOM, joinedRoomEvent);
    }
    async handleLeaveRoomEvent(event: LeaveRoomEvent, socket: socketio.Socket): Promise<void> {
        socket.leave(event.roomToLeave.roomName);
        const leftRoomEvent: LeftRoomEvent = {
            user: event.user,
            time: new Date().toISOString(),
        }
        socket.to(event.roomToLeave.roomName).emit(LEFT_ROOM_EVENT, leftRoomEvent);
    }


    async configureEventHandling(input: socketio.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): Promise<socketio.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>> {
        input.on(CONNECT_EVENT, (socket: socketio.Socket) => this.handleConnectEvent(socket));
        return input;
    }

}