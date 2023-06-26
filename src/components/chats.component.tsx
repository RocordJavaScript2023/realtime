"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "@/components/css/chats.css";
import { RoomDTO } from "@/lib/types/dto/room-dto";
import { UserDTO } from "@/lib/types/dto/user-dto";
import { socket } from "@/lib/socket/socket-init";
import {
  MESSAGE_FROM_CLIENT_EVENT,
  MessageEvent,
} from "@/lib/types/events/message-event";
import { TYPING_EVENT, TypingEvent } from "@/lib/types/events/typing-event";
import ChatWindow from "./chat-window.component";

export default function Chats({
  currentUser,
  roomArray,
  itemsPerPage,
  searchTerm,
}: {
  currentUser: UserDTO;
  roomArray: RoomDTO[];
  itemsPerPage: number;
  searchTerm: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [chatName, setchatName]: [string, Dispatch<SetStateAction<string>>] =
    useState(roomArray[0]?.roomName?? "Default Room");
  const [data, setData]: [RoomDTO[], Dispatch<SetStateAction<RoomDTO[]>>] =
    useState(roomArray);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredData: RoomDTO[] = data.filter((chat: RoomDTO) =>
    chat.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentchats: RoomDTO[] = filteredData.slice(startIndex, endIndex);

  const squares = currentchats.map((item: RoomDTO) => (
    // SonarLint: don't use array index in keys.
    <div key={item.id}>
      <div className="square-2" onClick={() => handlechatClick(item)}>
        {item.roomName}
      </div>
    </div>
  ));


  // types..
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage((prevPageNumber) => pageNumber);
  };

  // types...
  const handlechatClick = (chat: RoomDTO) => {
    setchatName((prevChat) => chat.roomName);
  };

  //todo optimieren?
  // use correct imports.
  // also, where is the useEffect being anchored to?
  // if no dependency-array is specified, useEffect will simply continue to loop endlessly.
  // add an empty Array as dependency array, that way it will only run on mount and unmount.
  // add a variable in the dependency array, and useEffect will be executed every time the
  // monitored value changes.
  useEffect(() => {
    if (searchTerm.length > 0 && startIndex != 1 && currentchats.length < 12) {
      setCurrentPage(1);
    }
  }, [searchTerm.length, startIndex, currentchats.length]);

  return (
    <div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="grid-container-2">{squares}</div>
      <ChatWindow
        chatName={chatName}
        currentUser={currentUser}
        currentRoom={roomArray[roomArray.findIndex((room: RoomDTO) => { return room.roomName === chatName; })]}
      />
    </div>
  );
}
