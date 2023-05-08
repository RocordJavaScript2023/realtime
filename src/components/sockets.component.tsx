'use client';

import { DefaultEventsMap } from "@socket.io/component-emitter";
import { SetStateAction, useEffect, useState } from "react";

import io, { Socket } from 'socket.io-client';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const SocketInput = () => {
    const [input, setInput] = useState('');

    useEffect( () => {
        socketInitializer();
    }, []);

    const socketInitializer = async () => {
        socket = io('http://localhost:3000', { path: '/api/socket/'});

        socket.on('connect', () => {
            console.log('connected');
        });

        socket.on('update-input', msg => {
            setInput(msg);
       });
    }

    const onChangeHandler = (e: { target: { value: SetStateAction<string>; }; }) => {
        setInput(e.target.value);
        socket.emit('input-change', e.target.value);
    }

    return (
        <input 
        placeholder="Type Something"
        value={input}
        onChange={onChangeHandler}
        />
    );
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default SocketInput;