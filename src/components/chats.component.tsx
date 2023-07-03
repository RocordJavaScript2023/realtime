"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "@/components/css/chats.css";
import { RoomDTO } from "@/lib/types/dto/room-dto";
import { UserDTO } from "@/lib/types/dto/user-dto";
import ChatWindow from "./chat-window.component";
import { CreateRoomRequest } from "@/lib/types/request/create-room-request";
import { json } from "stream/consumers";

export default function Chats({
  currentUser,
  roomArray,
  setRoomArrayFnc,
  itemsPerPage,
  searchTerm,
}: {
  currentUser: UserDTO;
  roomArray: RoomDTO[];
  setRoomArrayFnc: Dispatch<SetStateAction<RoomDTO[]>>;
  itemsPerPage: number;
  searchTerm: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [chatName, setChatName]: [string, Dispatch<SetStateAction<string>>] =
    useState(roomArray[0]?.roomName ?? "Default Room");
  const [data, setData]: [RoomDTO[], Dispatch<SetStateAction<RoomDTO[]>>] =
    useState(roomArray);
  const [showForm, setShowForm] = useState(false);

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
    setChatName((prevChat) => chat.roomName);
  };

  const handleDeleteClick = (roomNumber: string) => {
    const shouldDelete = window.confirm(
      `Do you want to delete room ${roomNumber}?`
    );
    if (shouldDelete) {
      const newData = data.filter((room: RoomDTO) => room.id !== roomNumber);
      setData(newData);
      const newTotalPages = Math.ceil(newData.length / itemsPerPage);
      if (newTotalPages < totalPages) {
        setCurrentPage(Math.min(currentPage, newTotalPages));
      }
    }
  };

  const handleCreateRoom = () => {
    setShowForm(true);
    //todo geht das besser?
    setTimeout(() => {
      const inputElement = document
        .getElementById("create-room-input")
        ?.focus();
    }, 0);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    const input = e.currentTarget.elements.namedItem(
      "creteRoomInput"
    ) as HTMLInputElement;

    const roomDTOTotransfer: RoomDTO = {
      id: "",
      serverId:
        roomArray[
          roomArray.findIndex((room: RoomDTO) => {
            return room.roomName === chatName;
          })
        ].serverId,
      roomName: input.value,
    };

    const createRoomRequest: CreateRoomRequest = {
      user: currentUser,
      roomToCreate: roomDTOTotransfer,
    };

    try {
      const res = await fetch("/api/room/create", {
        method: "POST",
        body: JSON.stringify(createRoomRequest),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        res.json().then((value: any) => {
          // If response is OK -> Body contains new room
          const received: RoomDTO = value.data as RoomDTO;
          setRoomArrayFnc((old: RoomDTO[]) => {
            return [...old, received];
          });
        });
      } else {
        alert("Room name must be unique");
      }
    } catch (error: any) {
      console.log("error");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      handleCancel();
    }
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
      {!showForm && (
        <button className="create-room-btn" onClick={handleCreateRoom}>
          <h2>Create Room</h2>
        </button>
      )}
      {showForm && (
        <form className="form" onSubmit={handleSave}>
          <input
            id="create-room-input"
            name="creteRoomInput"
            type="text"
            onKeyDown={handleKeyDown}
            style={{ outline: "none" }}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      )}
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
        currentRoom={
          roomArray[
            roomArray.findIndex((room: RoomDTO) => {
              return room.roomName === chatName;
            })
          ]
        }
      />
    </div>
  );
}
