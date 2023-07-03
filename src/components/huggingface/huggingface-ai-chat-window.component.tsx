"use client";

import { useChat } from "ai/react";
import bot from "./../../animations/robot-avatar.json";
import Lottie from "react-lottie-player";
import { Dispatch, SetStateAction, useState } from "react";
import { useCollapse } from "react-collapsed";
import "./../css/huggingface/huggingface-ai-chat-window.css";

export default function HuggingFaceChat() {
  const [showChat, setShowChat]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false);

  const handleButtonClick = () => {
    setShowChat((old) => !old);
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/huggingface/",
  });

  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <div className="bot-assistant">
      <div className="collapsible">
        <div {...getCollapseProps()}>
          <div className="bot-chat-window-content">
            <div className="bot-chat-window-messages">
              {messages.map((m) => (
                <>
                  <div key={m.id}>
                    {m.role === "user" ? "User: " : "AI: "}
                    {m.content}
                  </div>
                  <hr />
                </>
              ))}

              <form onSubmit={handleSubmit}>
                <input
                  value={input}
                  type="text"
                  placeholder="Talk to your assistant..."
                  onChange={handleInputChange}
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        </div>
        <div className="header" {...getToggleProps()}>
          <div className="bot-window-expand-button">
            <Lottie
              play
              loop
              style={{ width: 150, height: 150 }}
              animationData={bot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
