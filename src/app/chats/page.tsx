"use client";
import Content from "@/components/content.component";
import "@/components/css/app.css";
import ChatsComponent from "@/components/chats.component";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { socket } from "@/lib/socket/socket-init";
import { BROADCAST_MESSAGE_EVENT, BroadcastMessageEvent } from "@/lib/types/events/broadcast-message-event";
import { CONNECT, CONNECTION_EVENT, ConnectionEventMessage, DISCONNECT } from "@/lib/types/events/connection-event";
import { JOIN_ROOM, JoinRoomEvent, JoinedRoomEvent } from "@/lib/types/events/join-room-event";
import { LEAVE_ROOM_EVENT, LeaveRoomEvent, LeftRoomEvent } from "@/lib/types/events/leave-room-event";
import { RoomDTO } from "@/lib/types/dto/room-dto";
import { MESSAGE_FROM_CLIENT_EVENT, MESSAGE_FROM_SERVER_EVENT } from "@/lib/types/events/message-event";
import { Socket } from "socket.io-client";
import beehive  from './../../animations/beehive-loader.json';
import Lottie from "react-lottie-player";
import { UserDTO } from "@/lib/types/dto/user-dto";
import { MessageEvent } from "@/lib/types/events/message-event";

export default function Chats() {
  const pageName = "Chats";

  // I'm gonna try to shoehorn the socket.io logic
  // into this application.
  // But the logical layout makes it somewhat difficult.
  // The event listeners for the connection to the servers
  // are getting registered here.
  // This component will store the necessary state data and 
  // pass it on to it's children via props.
  const [isConnected, setIsConnected]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(socket.connected);
  const [currentUser, setCurrentUser]: [UserDTO, Dispatch<SetStateAction<UserDTO>>] = useState({ id: 'UNKNOWN', name: 'UNKNOWN', email: 'UNKNOWN', picture: 'UNKNOWN'});
  const [messageEvents, setMessageEvents]: [MessageEvent[], Dispatch<SetStateAction<MessageEvent[]>>] = useState(new Array<MessageEvent>());
  const [broadCastEvents, setBroadCastEvents]: [BroadcastMessageEvent[], Dispatch<SetStateAction<BroadcastMessageEvent[]>>] = useState(new Array<BroadcastMessageEvent>());
  const [connectionEvents, setConnectionEvents]: [ConnectionEventMessage[], Dispatch<SetStateAction<ConnectionEventMessage[]>>] = useState(new Array<ConnectionEventMessage>());
  const [joinRoomEvents, setJoinRoomEvents]: [JoinRoomEvent[], Dispatch<SetStateAction<JoinRoomEvent[]>>] = useState(new Array<JoinRoomEvent>());
  const [joinedRoomEvents, setJoinedRoomEvents]: [JoinedRoomEvent[], Dispatch<SetStateAction<JoinedRoomEvent[]>>] = useState(new Array<JoinedRoomEvent>());
  const [leaveRoomEvents, setLeaveRoomEvents]: [LeaveRoomEvent[], Dispatch<SetStateAction<LeaveRoomEvent[]>>] = useState(new Array<LeaveRoomEvent>());
  const [leftRoomEvents, setLeftRoomEvents]: [LeftRoomEvent[], Dispatch<SetStateAction<LeftRoomEvent[]>>] = useState(new Array<LeftRoomEvent>());
  const [roomArray, setRoomArray]: [RoomDTO[], Dispatch<SetStateAction<RoomDTO[]>>] = useState(new Array<RoomDTO>());

  useEffect(() => {

    // load Data from the backend
    if (roomArray.length === 0) {
      // fetch all available rooms
      fetch('/api/room/', {
        method: 'GET',
      }).then((response: Response) => {
        response.json().then((value: any) => {
          
          // If response is OK -> Body contains array with all rooms
          if (response.status === 200) {

            const receivedRooms: RoomDTO[] = value.data as RoomDTO[];
            setRoomArray(roomArray => receivedRooms);
          } else {
            // TODO: remove alert
            alert(`REQUEST FAILED! REASON: ${response.status}`);
          }
        })
      }).catch((reason: any) => {
        console.log(reason);
        alert(`Unable to load data from backend! Reason: ${reason}`);
      }); 
    }

    if (currentUser.id === 'UNKNOWN') {
      // fetch the current User based on his Session Data.
      fetch('/api/user/current/', {
        method: 'GET',
      }).then((response: Response) => {
        response.json().then((value: any) => {

          // if response is OK -> Body contains a single UserDTO object with current user
          if (response.status === 200) {
            
            const receivedCurrentUser: UserDTO = value.data as UserDTO;
            setCurrentUser(previousCurrentUser => receivedCurrentUser);

          } else {
            alert(`REQUEST FAILED! REASON: ${response.status}`);
          }

        }).catch((reason: any) => {
          alert(`UNABLE TO PARSE JSON-BODY OF RESPONSE! REASON: ${reason}`);
        }) 
      }).catch((reason: any) => {
        alert(`UNABLE TO FETCH CURRENT USER SESSION! REASON: ${reason}`);
      })
    }

    // Connect the socket.
    socket.connect();
    console.log('Connecting to socket')

    function onConnect() {
      console.log('Connected to socket');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('Disconnected from socket');
      setIsConnected(false);
    }

    // receive Messages from the server
    function handleMessageEventFromServerToClient(event: MessageEvent) {
      setMessageEvents(previousMessageEvents => [...previousMessageEvents, event]);
    }

    // receive BroadCasts from the server
    function handleBroadCastEventsFromServer(event: BroadcastMessageEvent) {
      setBroadCastEvents(previousBroadCastEvents => [...previousBroadCastEvents, event]);
    }

    // configure the logic for the socket-connection.
    socket.on(CONNECT, onConnect);
    socket.on(DISCONNECT, onDisconnect);
    socket.on(MESSAGE_FROM_SERVER_EVENT, (event: MessageEvent) => handleMessageEventFromServerToClient(event));
    socket.on(BROADCAST_MESSAGE_EVENT, (event: BroadcastMessageEvent) => handleBroadCastEventsFromServer(event));

    if (roomArray.length !== 0) {
      for (const room of roomArray) {
        const joinRoomEvent: JoinRoomEvent = {
          roomToJoin: room,
          user: currentUser
        }
        // join the available rooms
        socket.emit(JOIN_ROOM, joinRoomEvent);
        console.log(`Sending join request for room: ${room.roomName}`);
      }
    }

    // Any event listeners registered in the setup function must be 
    // removed in the cleanup callback in order to prevent 
    // duplicate event registrations.
    // Also, the event listeners are named functions, so calling socket.off() only
    // removes the specific event listener.
    return () => {

      // Cleanup
      socket.off(CONNECT, onConnect);
      socket.off(DISCONNECT, onDisconnect);
      socket.off(MESSAGE_FROM_SERVER_EVENT, handleMessageEventFromServerToClient)
      socket.off(BROADCAST_MESSAGE_EVENT, handleBroadCastEventsFromServer);

      // If we need to close the socket.io client when the component is unmounted,
      // for example if the connection is only needed in a specific part of our application,
      // the we should ensure that socket.connect() is called on initial setup. (which it is)
      // and then call: socket.disconnect()
      socket.disconnect();
    }

  }, []);

  if (isConnected && currentUser.id !== 'UNKNOWN') {
    return (
      <div>
        <div className="app">
          <Content
            title={pageName}
            component={<ChatsComponent connectionStatus={isConnected} messageEvents={messageEvents} currentUser={currentUser} roomArray={roomArray} itemsPerPage={8} searchTerm=""/>}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="loading-spinner-wrapper">
        <Lottie play loop animationData={beehive} style={{ width: 400, height: 400 }}/>
      </div>
    </div>
  );
}
