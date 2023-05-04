import { Server } from 'socket.io';

const socketHandler = (req: any, res: any) => {
    if (res.socket.server.io) {
        console.log('Socket is already up');
    } else {
        console.log('Socket starting up');
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', socket => {
            socket.on('input-change', msg => {
                socket.broadcast.emit('update-input', msg);
            });
        })
    }

    res.end();
}

export default socketHandler;