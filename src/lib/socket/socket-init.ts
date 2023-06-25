/**
 * Implemented using this guide: https://socket.io/how-to/use-with-react
 */
import { io } from "socket.io-client";

// 'undefined' means the URL will be computed from the `window.location` object
const URL: string = 'http://localhost:3000';

// By default, the Socket.IO client will open a connection to the server right away.
// To prevent this behavior, we can configure the `autoConnect` options
// IF the autoConnect option has been disabled, we need to call `socket.connect()` manually
// to ensure that the client connects to the server.
// This is useful, when the user must present some kind of credentials before connecting.
// Also, during development we need to enable CORS on our server
export const socket = io(URL, {
    autoConnect: false,
});