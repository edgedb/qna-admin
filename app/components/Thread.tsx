import Message from "./Message";
import { auth } from "../edgedb";

interface ThreadProps {
  messages: any[];
  title: string;
}

export default function Thread({ title, messages }: ThreadProps) {
  const session = auth.getSession();

  return (
    <div className="">
      <h2>{title}</h2>
      {messages.map((msg) => (
        <Message
          key={msg.id}
          msg={msg}
          editable={true}
          token={session.authToken}
        />
      ))}
    </div>
  );
}
