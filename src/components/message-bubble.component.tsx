import MessageDTO from "@/lib/types/dto/message-dto";
import { UserDTO } from "@/lib/types/dto/user-dto";
import "./css/messageBubble.css";

export default function MessageBubble({
  message,
  currentUser,
}: {
  message: MessageDTO;
  currentUser: UserDTO;
}) {
  const userName: string = message.user.name;
  const sentAt: string = new Date(message.createdAt).toDateString();
  const content: string = message.content;
  const chatFromCurrentUser: Boolean = message.user.id == currentUser.id;

  return (
    <div
      className={
        chatFromCurrentUser ? "message-bubble-current" : "message-bubble"
      }
    >
      <h6 className="sent-by">
        {userName}
        <span className="sent-at">{sentAt}</span>
      </h6>

      <div className="content-wrapper-x">
        <p className="msg">{content}</p>
      </div>
    </div>
  );
}
