import MessageDTO from "@/lib/types/dto/message-dto";

export default function MessageBubble({ message }: { message: MessageDTO }) {
  const userName: string = message.user.name;
  const sentAt: string = message.createdAt.toDateString();
  const content: string = message.content;

  return (
    <div className="message-bubble">
      <h6 className="sent-by">{userName}</h6>
      <div className="sent-at">{sentAt}</div>
      <div className="content-wrapper">
        <p>{content}</p>
      </div>
    </div>
  );
}
