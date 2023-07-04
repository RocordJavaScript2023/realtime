import React from "react";
import Link from "next/link";
import { UserDTO } from "@/lib/types/dto/user-dto";
import "@/components/css/sidebar.css";
import  {LogoutButton} from "@/components/buttons.component";

export default function Sidebar({ currentUser }: { currentUser: UserDTO }) {

  const userImage: string = currentUser.picture === '' ? `https://robohash.org/${currentUser.name}` : currentUser.picture;

  return (
    <div className="sidebar">
      <div className="profile">
        <img src={userImage} alt="User Profile Picture" />
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
          <LogoutButton></LogoutButton>
        </div>
      </div>
    </div>
  );
}
