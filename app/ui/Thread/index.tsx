import Message from "../Message";

interface ThreadProps {
  title: string;
  messages: any[];
}

export default function Thread({ title, messages }: ThreadProps) {
  return (
    <div>
      <h4 className="capitalize ml-3 mb-1">{title}</h4>
      {messages.map((msg) => (
        <Message key={msg.id} msg={msg} editable={true} />
      ))}
    </div>
  );
}
