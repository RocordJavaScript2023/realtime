import React from "react";
import Link from "next/link";
import { UserDTO } from "@/lib/types/dto/user-dto";
import "@/components/css/sidebar.css";

export default function Sidebar({ currentUser }: { currentUser: UserDTO }) {
  return (
    <div className="sidebar">
      <div className="profile">
        <img src="https://reactjs.org/logo-og.png" alt="React Image" />
        <div className="container">
          <p className="user-data">
            {currentUser ? currentUser.name : ""}
          </p>
          <p className="status-message"></p>
        </div>
      </div>
      <div className="navigation">
        <ul>
          <li>
            <Link href="/chats" className="text-ct-dark-600">
              Chats
            </Link>
          </li>
          <li>
            <Link href="/users" className="text-ct-dark-600">
              User
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
