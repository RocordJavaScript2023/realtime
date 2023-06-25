export const CONNECTION_EVENT: string = 'connection-established';
export const CONNECT: string = 'connect';
export const DISCONNECT: string = 'disconnect';

export interface ConnectionEventMessage {
    connectionTime: string;
    messageContent: string;
}