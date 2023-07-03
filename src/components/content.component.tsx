"use client";
import "@/components/css/content.css";
import Notification from "@/components/notification.component";
import Sidebar from "@/components/sidebar.component";
import React, { useState } from "react";

// again, types are needed for checking if code is actually correct.
export default function Content({ title, component }: { title: string, component: JSX.Element}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="content">
      <Sidebar currentUser={...component.props.currentUser} />
      <div className="content2">
        <div className="title">
          <h1>{title}</h1>
          <input
            className="search"
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
