import MessageDTO from "../dto/message-dto";

export const MESSAGE_FROM_CLIENT_EVENT: string = 'message-from-client';
export const MESSAGE_FROM_SERVER_EVENT: string = 'message-from-server';

export interface MessageEvent {
    message: MessageDTO;
}