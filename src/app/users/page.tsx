"use client";
import Content from "@/components/content.component";
import "@/components/css/app.css";
import UsersComponent from "@/components/users.component";
import { UserDTO } from "@/lib/types/dto/user-dto";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function Users() {
  const pageName: string = "Users";
  const [currentUser, setCurrenUser]: [
    UserDTO,
    Dispatch<SetStateAction<UserDTO>>
  ] = useState({
    id: "UNKNOWN",
    name: "UNKNOWN",
    email: "UNKNOWN",
    picture: "UNKNOWN",
  });
  const router = useRouter();

  useEffect(() => {
    if (currentUser.id === "UNKNOWN") {
      fetch("/api/user/current/", {
        method: "GET",
      })
        .then((response: Response) => {
          if (response.status === 200) {
            response.json().then((value: any) => {
              const receivedUser: UserDTO = value.data as UserDTO;
              setCurrenUser((old) => receivedUser);
            });
          } else {
            router.push("/login");
          }
        })
        .catch((reason: any) => {
          console.log(reason);
          router.push("/login");
        });
    }
  }, []);

  return (
    <div>
      <div className="app">
        <Content
          title={pageName}
          component={<UsersComponent currentUser={currentUser} searchTerm="" itemsPerPage={12} />}
        />
      </div>
    </div>
  );
}
