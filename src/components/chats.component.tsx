"use client";
import React, { useState } from "react";
import "@/components/css/chats.css";
import { RoomDTO } from "@/lib/types/dto/room-dto";

// Where are the type annotations???
export default function Chats({ roomArray, itemsPerPage, searchTerm }: { roomArray: RoomDTO[], itemsPerPage: number, searchTerm: string}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [chatName, setchatName] = useState("");
  const [data, setData] = useState(roomArray);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredData: RoomDTO[] = data.filter((chat: RoomDTO) =>
    chat.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentchats = filteredData.slice(startIndex, endIndex);

  const squares = currentchats.map((item, index) => (
    <div key={index}>
      <div className="square-2" onClick={() => handlechatClick(item)}>
        {item}
      </div>
    </div>
  ));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlechatClick = (chatNumber) => {
    setchatName(chatNumber)
  };

  //todo optimieren?
  React.useEffect(() => {
    if (searchTerm.length > 0 && startIndex != 1 && currentchats.length < 12) {
      setCurrentPage(1);
    }
  });

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
      <div className="chat">
        <h1>{chatName}</h1>
        <input type="text" />
      </div>
    </div>
  );
}
