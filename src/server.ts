import { NextServer } from "next/dist/server/next";
import next, { NextApiHandler } from "next";
import express, { Express, Request, Response } from "express";
import * as http from "http";
import * as socketio from "socket.io";
import { SocketDriver } from "./lib/server/driver/socket-driver";

const port: number = parseInt(process.env.PORT ?? "3000", 10);
const devEnv: boolean = process.env.NODE_ENV !== "production";
const nextServer: NextServer = next({ dev: devEnv });
const nextRequestHandler: NextApiHandler = nextServer.getRequestHandler();

nextServer.prepare().then( async () => {

    const expressServer: Express = express();
    const plainHttpServer: http.Server = http.createServer(expressServer);
    const socketDriver: SocketDriver = new SocketDriver();
    // During development we need to enable CORS (Cross Origin Resource Sharing) on our Server.
    // What is CORS? --> https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    const socketIOWebSocketServer: socketio.Server = await socketDriver.configureEventHandling(new socketio.Server({
        cors: {
            origin: `http://localhost:${port}`,
        }
    }));

    // attach the socket.io server - then it'll be able to listen in on ws://localhost:3000/
    socketIOWebSocketServer.attach(plainHttpServer);

    // Re-Route all Requests to the underlying Express/http Server to the NextServer
    expressServer.all('*', (req: any, res: any) => nextRequestHandler(req, res));

    // Start listening for incoming Requests
    plainHttpServer.listen(port, () => {
        console.log(`Custom WebSocket Server listening on http://localhost:${port}`);
    });

}).catch((reason: any) => {
    console.log("NEXT SERVER WAS UNABLE TO START!!!");
    console.log(`REASON: ${reason}`);
})
