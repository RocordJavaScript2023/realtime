import MessageDTO from "@/lib/types/dto/message-dto";
import { RoomDTO } from "@/lib/types/dto/room-dto";
import { MESSAGE_FROM_SERVER_EVENT, MessageEvent } from "@/lib/types/events/message-event";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MessageBubble from "./message-bubble.component";
import { v4 as uuid } from 'uuid';
import { hashSync } from "bcryptjs";
import ChatInput from "./chat-input.component";
import { UserDTO } from "@/lib/types/dto/user-dto";
import { socket } from "@/lib/socket/socket-init";
import { JOIN_ROOM, JoinRoomEvent } from "@/lib/types/events/join-room-event";
import { LEAVE_ROOM_EVENT, LeaveRoomEvent } from "@/lib/types/events/leave-room-event";

export default function ChatWindow({
  chatName,
  currentRoom,
  currentUser,
}: {
  chatName: string;
  currentRoom: RoomDTO;
  currentUser: UserDTO;
}) {
  const [loadedMessages, setLoadedMessages]: [
    MessageDTO[],
    Dispatch<SetStateAction<MessageDTO[]>>
  ] = useState(new Array<MessageDTO>());


  // re-load messages on room switch
  useEffect(() => {
    console.log(`Room changed, trying to fetch data for ${currentRoom.id} - ${currentRoom.roomName}`);
    console.log('ROOM CHANGED RELOADING MESSAGES ...');

    console.log('Sending Request to join new room');
    const joinRoomRequest: JoinRoomEvent = {
      roomToJoin: currentRoom,
      user: currentUser
    }

    socket.emit(JOIN_ROOM, joinRoomRequest);

    fetch(`/api/message/room/name/${currentRoom.roomName.replaceAll(' ', '%20')}`, {
      method: 'GET',
    }).then((response: Response) => {
      if (response.status === 200) {
        response.json().then((value: any) => {
          console.log('Retrieved new Messages');
          console.log("OLD MESSAGES:")
          console.log(loadedMessages);
          const transmittedMessages: MessageDTO[] = value.data as MessageDTO[];
          console.log("NEW MESSAGES:")
          console.log(transmittedMessages);
          setLoadedMessages((old: MessageDTO[]) => {
            return transmittedMessages;
          });
          console.log('setting new messages');

        }).catch((reason: any) => {
          alert(`UNABLE TO PARSE JSON BODY! REASON: ${reason}`);
        })
      }
    }).catch((reason: any) => {
      alert(`UNABLE TO LOAD MESSAGES FOR CURRENT ROOM! REASON: ${reason}`);
    })

  }, [currentRoom])

  useEffect(() => {

    // handle incoming Message Events
    function handleIncomingMessages(event: MessageEvent) {
      console.log('MESSAGE INCOMING FROM SERVER');
      setLoadedMessages((old: MessageDTO[]) => {
        return [...old, event.message];
      });
    }

    const joinRoomRequest: JoinRoomEvent = {
      roomToJoin: currentRoom,
      user: currentUser,
    }

    socket.on(MESSAGE_FROM_SERVER_EVENT, handleIncomingMessages);

    socket.emit(JOIN_ROOM, joinRoomRequest);


    // fetch messages for room
    if (loadedMessages.length === 0 && currentRoom) {

      fetch(`/api/message/room/name/${currentRoom.roomName}`, {
        method: "GET",
      })
        .then((response: Response) => {
          if (response.status === 200) {
            response
              .json()
              .then((value: any) => {
                const transmittedMessages: MessageDTO[] =
                  value.data as MessageDTO[];
                setLoadedMessages((old: MessageDTO[]) => {
                  return transmittedMessages;
                });
              })
              .catch((reason: any) => {
                alert(
                  `Unable to parse JSON-Body for Response! Reason: ${reason}`
                );
              });
          }
        })
        .catch((reason: any) => {
          alert(
            `Unable to fetch Messages for Room: ${currentRoom.id}! Reason: ${reason}`
          );
        });
    }

    return () => {
      const leaveRoomRequest: LeaveRoomEvent = {
        roomToLeave: currentRoom,
        user: currentUser,
      }
      socket.emit(LEAVE_ROOM_EVENT, leaveRoomRequest);
      socket.off(MESSAGE_FROM_SERVER_EVENT, handleIncomingMessages);
    }
  }, []);

  return (
    <div className="chat">
      <h1>{chatName}</h1>
      <div className="message-bubble-wrapper">{
        loadedMessages.map((message: MessageDTO) => {
            return (
                <MessageBubble key={hashSync(uuid())} message={message} />
            )
        })
      }</div>
      <ChatInput updateMessageFn={setLoadedMessages} currentUser={currentUser} currentRoom={currentRoom} />
    </div>
  );
}
