export const CONNECTION_EVENT: string = 'connection-established';

export interface ConnectionEventMessage {
    connectionTime: string;
    messageContent: string;
}