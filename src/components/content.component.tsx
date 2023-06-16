"use client";
import "@/components/css/content.css";
import Notification from "@/components/notification.component";
import Sidebar from "@/components/sidebar.component";
import React, { useState } from "react";

export default function Content({ title, component }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="content">
      <Sidebar />
      <Notification />
      <div className="content2">
        <div className="title">
          <h1>{title}</h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="content3">
          {component && (
            <component.type {...component.props} searchTerm={searchTerm} />
          )}
        </div>
      </div>
    </div>
  );
}
