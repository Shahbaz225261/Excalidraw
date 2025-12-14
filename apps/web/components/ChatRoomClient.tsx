"use client";

import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";

export default function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const { socket, loading } = useSocket();
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (!socket || loading) return;

    socket.send(
      JSON.stringify({
        type: "joinRoom",
        roomId: id,
      })
    );

    const handler = (event: MessageEvent) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === "chat" && parsedData.roomId === id) {
        setChats((c) => [...c, { message: parsedData.message }]);
      }
    };

    socket.addEventListener("message", handler);

    return () => {
      socket.removeEventListener("message", handler);
    };
  }, [socket, loading, id]);

  const handleSend = () => {
    if (!currentMessage.trim() || !socket) return;

    // optimistic update so it appears immediately
    setChats((c) => [...c, { message: currentMessage }]);

    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: id,
        message: currentMessage,
      })
    );

    setCurrentMessage("");
  };

  return (
    <div>
      {chats.map((m, index) => (
        <div key={index}>{m.message}</div>
      ))}

      <input
        value={currentMessage}
        type="text"
        onChange={(e) => setCurrentMessage(e.target.value)}
      />

      <button onClick={handleSend}>send message</button>
    </div>
  );
}