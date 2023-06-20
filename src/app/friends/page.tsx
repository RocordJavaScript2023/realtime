"use client";
import Content from "@/components/content.component";
import "@/components/css/app.css";
import FriendsComponent from "@/components/friends.component";

export default function Friends() {
  const pageName = "Friends";
  const dataArray = [
    "Friend 1",
    "Friend 2",
    "Friend 3",
    "Friend 4",
    "Friend 5",
    "Friend 6",
    "Friend 7",
    "Friend 8",
    "Friend 9",
    "Friend 10",
    "Friend 11",
    "Friend 12",
    "Friend 13",
    "Friend 14",
    "Friend 15",
  ];

  return (
      <div>
        <div className="app">
          <Content
              title={pageName}
              component={<FriendsComponent data={dataArray} itemsPerPage={15} />}
          />
        </div>
      </div>
  );
}