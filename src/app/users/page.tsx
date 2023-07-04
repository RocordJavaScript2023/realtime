"use client";
import Content from "@/components/content.component";
import "@/components/css/app.css";
import UsersComponent from "@/components/users.component";

export default function Users() {
  const pageName: string = "Users";
  return (
    <div>
      <div className="app">
        <Content
          title={pageName}
          component={<UsersComponent searchTerm="" itemsPerPage={12} />}
        />
      </div>
    </div>
  );
}
