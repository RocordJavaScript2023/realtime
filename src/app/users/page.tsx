"use client";
import Content from "@/components/content.component";
import "@/components/css/app.css";
import UsersComponent from "@/components/users.component";

export default function Users() {
  const pageName = "Users";
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

  //todo userdata übergeben
  return (
    <div>
      <div className="app">
        <Content
          title={pageName}
          component={<UsersComponent searchTerm="" data={dataArray} itemsPerPage={15} />}
        />
      </div>
    </div>
  );
}