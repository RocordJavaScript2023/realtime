"use client";
import React, { useState } from "react";
import "@/components/css/users.css";

export default function Chats({ data: initialData, itemsPerPage, searchTerm }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [chatName, setchatName] = useState("");
  const [data, setData] = useState(initialData);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredData = data.filter((chat) =>
    chat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentchats = filteredData.slice(startIndex, endIndex);

  const squares = currentchats.map((item, index) => (
    <div key={index}>
      <div className="square-3" onClick={() => handlechatClick(item)}>
        {item}
      </div>
    </div>
  ));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlechatClick = (chatNumber) => {
    setchatName(chatNumber);
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
      <div className="grid-container-3">{squares}</div>
    </div>
  );
}
