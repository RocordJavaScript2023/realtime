import React from "react";
import Link from "next/link";
import "@/components/css/sidebar.css"
import profileImage from "public/next.svg";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="profile">
        <img src="https://reactjs.org/logo-og.png" alt="React Image" />
        <p className="status-message">Status message goes here</p>
      </div>
      <div className="navigation">
        <ul>
          <li>
            <Link href="/rooms" className="text-ct-dark-600">
              Rooms
            </Link>
          </li>
          <li>
            <Link href="/chats" className="text-ct-dark-600">
              Chats
            </Link>
          </li>
          <li>
            <Link href="/friends" className="text-ct-dark-600">
              Friends
            </Link>
          </li>
          <li>
            <Link href="/settings" className="text-ct-dark-600">
              Settings
            </Link>
          </li>
        </ul>
      </div>
      <div className="bottom-section">
        <div className="logout-button">
          <button>Log out</button>
        </div>
      </div>
    </div>
  );
}
