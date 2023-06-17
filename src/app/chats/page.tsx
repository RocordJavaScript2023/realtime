"use client";
import Content from "@/components/content.component";
import "@/components/css/app.css";
import ChatsComponent from "@/components/chats.component";

export default function Chats() {
  const pageName = "Chats";
  const dataArray = [
    "Chat 1",
    "Chat 2",
    "Chat 3",
    "Chat 4",
    "Chat 5",
    "Chat 6",
    "Chat 7",
    "Chat 8",
    "Chat 9",
    "Chat 10",
    "Chat 11",
    "Chat 12",
  ];

  return (
    <div>
      <div className="app">
        <Content
          title={pageName}
          component={<ChatsComponent data={dataArray} itemsPerPage={8} />}
        />
      </div>
    </div>
  );
}
