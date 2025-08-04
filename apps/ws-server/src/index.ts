import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/index";
import jwt, { JwtPayload } from "jsonwebtoken";
import { client } from "@repo/src/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    if (typeof decode === "string") return null;
    if (!decode || !(decode as JwtPayload).userId) return null;
    return (decode as JwtPayload & { userId: string }).userId;
  } catch {
    return null;
  }
}

wss.on("connection", (socket, request) => {
  const url = request.url;
  if (!url) return socket.close(1008, "Missing URL");

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");
  if (!token) {
    socket.close(1008, "Missing token");
    return;
  }

  const userId = checkUser(token);
  if (!userId) {
    socket.close(1008, "Invalid token");
    return;
  }

  users.push({
    ws: socket,
    rooms: [],
    userId,
  });

  socket.on("message", async (data) => {
    let parsedData;
    try {
      parsedData = JSON.parse(data.toString());
    } catch {
      socket.send(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }

    if (parsedData.type === "joinRoom") {
      const user = users.find((x) => x.ws === socket);
      if (!user) return;

      // Check access permission to join room
      if (!user.rooms.includes(parsedData.roomId)) {
        user.rooms.push(parsedData.roomId);
      }
    }

if (parsedData.type === "leave_room") {
  const user = users.find((x) => x.ws === socket);
  console.log("Leave room request:", parsedData.roomId);
  if (!user) {
    console.log("User not found for given socket");
    return;
  }
  console.log("Rooms before leaving:", user.rooms);

  user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);

  console.log("Rooms after leaving:", user.rooms);

  // Optionally send confirmation back to client
  socket.send(JSON.stringify({ type: "left_room", roomId: parsedData.roomId }));
}


    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await client.chat.create({
        data:{
          message,
          roomId,
          userId
        }
      })

      users.forEach((e) => {
        if (e.rooms.includes(roomId)) {
          if (e.ws.readyState === e.ws.OPEN) {
            e.ws.send(
              JSON.stringify({
                userId,
                roomId,
                message: message,
                timestamp: new Date().toISOString(),
              })
            );
          }
        }
      });
    }
  });

  socket.on("close", () => {
    const index = users.findIndex((x) => x.ws === socket);
    if (index !== -1) users.splice(index, 1);
  });
});
