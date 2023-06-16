"use client";
import Content from "@/components/content.component";
import "@/components/css/app.css";
import RoomsComponent from "@/components/rooms.component";

export default function Rooms() {
  const pageName = "Rooms";
  const dataArray = [
    "Room 1",
    "Room 2",
    "Room 3",
    "Room 4",
    "Room 5",
    "Room 6",
    "Room 7",
    "Room 8",
    "Room 9",
    "Room 10",
    "Room 11",
    "Room 12",
  ];

  return (
    <div>
      <div className="app">
        <Content
          title={pageName}
          component={<RoomsComponent data={dataArray} itemsPerPage={12} />}
        />
      </div>
    </div>
  );
}
