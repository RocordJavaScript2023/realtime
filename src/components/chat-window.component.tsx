import MessageDTO from "@/lib/types/dto/message-dto";
import { RoomDTO } from "@/lib/types/dto/room-dto";
import { MessageEvent } from "@/lib/types/events/message-event";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MessageBubble from "./message-bubble.component";

export default function ChatWindow({
  chatName,
  currentVal,
  typingStatus,
  messageEvents,
  currentRoom,
  onChange,
  onKeyDown,
}: {
  chatName: string;
  currentVal: string;
  typingStatus: string;
  messageEvents: MessageEvent[];
  currentRoom: RoomDTO;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const [loadedMessages, setLoadedMessages]: [
    MessageDTO[],
    Dispatch<SetStateAction<MessageDTO[]>>
  ] = useState(new Array<MessageDTO>());

  useEffect(() => {
    // fetch messages for room
    if (loadedMessages.length === 0) {
      fetch(`/api/message/room/${currentRoom.id}`, {
        method: "GET",
      })
        .then((response: Response) => {
          if (response.status === 200) {
            response
              .json()
              .then((value: any) => {
                const transmittedMessages: MessageDTO[] =
                  value.data as MessageDTO[];
                setLoadedMessages((old) => transmittedMessages);
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
  }, []);

  useEffect(() => {
    function mergeAndSortMessages(oldMessages: MessageDTO[]) {
      const newMergedMessages = new Array<MessageDTO>();

      for (const message of oldMessages) {
        newMergedMessages.push(message);
      }

      for (const messageEvent of messageEvents) {
        newMergedMessages.push(messageEvent.message);
      }

      newMergedMessages.sort((a: MessageDTO, b: MessageDTO) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      return newMergedMessages;
    }

    setLoadedMessages((oldMessages) => {
      return mergeAndSortMessages(oldMessages);
    });

  }, [messageEvents]);

  return (
    <div className="chat">
      <h1>{chatName}</h1>
      <div className="message-bubble-wrapper">{
        loadedMessages.map((message: MessageDTO) => {
            return (
                <MessageBubble key={message.content} message={message} />
            )
        })
      }</div>
      <div className="typing-indicator">{typingStatus}</div>
      <input
        type="text"
        placeholder="Type your message here"
        value={currentVal}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
