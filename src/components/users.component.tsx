"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "@/components/css/users.css";
import { UserDTO } from "@/lib/types/dto/user-dto";
import beehive from "./../animations/beehive-loader.json";
import Lottie from "react-lottie-player";
import UserCard from "./users/cards/user-card.component";
import  { v4 as uuid } from 'uuid';

export default function UsersComponent({
  searchTerm,
  itemsPerPage,
  currentUser,
}: {
  searchTerm: string;
  itemsPerPage: number;
  currentUser: UserDTO;
}) {
  const [userData, setUserData]: [
    UserDTO[],
    Dispatch<SetStateAction<UserDTO[]>>
  ] = useState(new Array<UserDTO>());
  const [currentPage, setCurrentPage]: [
    number,
    Dispatch<SetStateAction<number>>
  ] = useState(1);

  // TODO: Check if re-render breaks application logic
  useEffect(() => {
    if (userData.length === 0) {
      fetch("/api/user/", {
        method: "GET",
      })
        .then((response: Response) => {
          if (response.status === 200) {
            response
              .json()
              .then((value: any) => {
                const fetchedUserDTOs: UserDTO[] = value.data as UserDTO[];
                setUserData((old: UserDTO[]) => {
                  return fetchedUserDTOs;
                });
              })
              .catch((reason: any) => {
                console.log(reason);
              });
          }
        })
        .catch((reason: any) => {
          console.log(reason);
        });
    }
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage((old) => pageNumber);
  };

  /*
  
  const [chatName, setchatName] = useState("");
  const [data, setData] = useState(initialData);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredData = data.filter((chat) =>
    chat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentchats = filteredData.slice(startIndex, endIndex);

  const squares = currentchats.map((item, index) => (
    <div key={index}>
      <div className="square-3" onClick={() => handlechatClick(item)}>
        {item}
      </div>
    </div>
  ));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlechatClick = (chatNumber) => {
    setchatName(chatNumber);
  };

  //todo optimieren?
  useEffect(() => {
    if (searchTerm.length > 0 && startIndex != 1 && currentchats.length < 12) {
      setCurrentPage(1);
    }
  }, [searchTerm, startIndex, currentchats]);

  return (
    <div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="grid-container-3">{squares}</div>
    </div>
  );
  */

  if (userData.length == 0) {
    return (
      <div>
        <div className="loading-spinner-wrapper">
          <Lottie
            play
            loop
            animationData={beehive}
            style={{ width: 400, height: 400 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pagination">
        {Array.from({ length: userData.length }, (_, index) => {
          return (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active": ""}
            >
              {index+1}
            </button>
          );
        })}
      </div>
      <div className="grid-container-3">{userData.map((user: UserDTO) => {
        return (
          <UserCard key={uuid()} user={user}/>
        );
      })}</div>
    </div>
  );
}
