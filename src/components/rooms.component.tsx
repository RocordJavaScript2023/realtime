"use client";
import React, { useState } from "react";
import "@/components/css/rooms.css";

export default function Rooms({ data: initialData, itemsPerPage, searchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [data, setData] = useState(initialData);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredData = data.filter((room) =>
    room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRooms = filteredData.slice(startIndex, endIndex);

  const squares = currentRooms.map((item, index) => (
    <div key={index}>
      <div className="square" onClick={() => handleRoomClick(item)}>
        {item}
      </div>
      <button className="delete-button" onClick={() => handleDeleteClick(item)}>
        X
      </button>
    </div>
  ));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRoomClick = (roomNumber) => {
    alert(`Open ${roomNumber}`);
  };

  const handleDeleteClick = (roomNumber) => {
    const shouldDelete = window.confirm(
      `Do you want to delete room ${roomNumber}?`
    );
    if (shouldDelete) {
      const newData = data.filter((room) => room !== roomNumber);
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
    setRoomName("");
  };

  const handleSave = () => {
    //todo es darf kein Raum mit dem selben Namen existieren
    if (roomName.trim() !== "") {
      const newRoom = roomName;
      data.push(newRoom);
      const newTotalPages = Math.ceil(data.length / itemsPerPage);
      if (newTotalPages > totalPages) {
        setCurrentPage(newTotalPages);
      }
      setShowForm(false);
      setRoomName("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  //todo optimieren?
  React.useEffect(() => {
    if (searchTerm.length > 0 && startIndex != 1 && currentRooms.length < 12) {
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
      <div className="grid-container">{squares}</div>
      {!showForm && (
        <button className="create-room-btn" onClick={handleCreateRoom}>
          <h2>Create Room</h2>
        </button>
      )}
      {showForm && (
        <div className="form">
          <input
            id="create-room-input"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
}
