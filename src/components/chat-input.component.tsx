import { UserDTO } from "@/lib/types/dto/user-dto";
import { TYPING_EVENT, TypingEvent } from "@/lib/types/events/typing-event";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { socket } from "@/lib/socket/socket-init";
import { RoomDTO } from "@/lib/types/dto/room-dto";
import { MESSAGE_FROM_CLIENT_EVENT, MessageEvent } from "@/lib/types/events/message-event";
import MessageDTO from "@/lib/types/dto/message-dto";

export default function ChatInput({
  currentUser,
  currentRoom,
  updateMessageFn,
}: {
  currentUser: UserDTO;
  currentRoom: RoomDTO;
  updateMessageFn: Dispatch<SetStateAction<MessageDTO[]>>
}) {
  const [currentMessageContent, setCurrentMessageContent]: [
    string,
    Dispatch<SetStateAction<string>>
  ] = useState("");
  const [typingStatus, setTypingStatus]: [
    string,
    Dispatch<SetStateAction<string>>
  ] = useState("");

  useEffect(() => {
    function handleTypingEvent(event: TypingEvent) {
      setTypingStatus((old) => `${event.user.name} is typing ...`);
    }

    socket.on(TYPING_EVENT, handleTypingEvent);

    return () => {
      socket.off(TYPING_EVENT, handleTypingEvent);
    };
  }, []);

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    setCurrentMessageContent(event.currentTarget.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    emitTypingEventMessage(event.currentTarget.value);
    if (event.key === "Escape") {
      setCurrentMessageContent((old) => "");
    } else if (event.key === "Enter") {
      emitMessageEventToServer(currentMessageContent);
    } 
  };

  const emitMessageEventToServer = (messageContent: string) => {
    const messageEvent: MessageEvent = {
        message: {
            user: currentUser,
            createdAt: new Date(),
            content: messageContent,
            roomUsed: currentRoom,
        }
    }
    setCurrentMessageContent(old => '');
    updateMessageFn((old: MessageDTO[]) => {
        return [...old, messageEvent.message];
    })
    socket.emit(MESSAGE_FROM_CLIENT_EVENT, messageEvent);
  }

  const emitTypingEventMessage = (messageContent: string) => {
    const typingEvent: TypingEvent = {
      user: currentUser,
      room: currentRoom,
    };

    socket.emit(TYPING_EVENT, typingEvent);
  };

  return (
    <div className="chat-input-wrapper">
      <div className="typing-status-indicator">{typingStatus}</div>
      <input
        type="text"
        placeholder="Type your message here"
        value={currentMessageContent}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
