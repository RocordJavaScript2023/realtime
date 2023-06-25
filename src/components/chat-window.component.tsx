export default function ChatWindow({
  chatName,
  currentVal,
  typingStatus,
  onChange,
  onKeyDown,
}: {
  chatName: string;
  currentVal: string;
  typingStatus: string;
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="chat">
      <h1>{chatName}</h1>
      <div className="typing-indicator">{typingStatus}</div>
      <input
        type="text"
        placeholder="Type your message here"
        value={currentVal}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
