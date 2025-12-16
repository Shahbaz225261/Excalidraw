import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/index";
import jwt, { JwtPayload } from "jsonwebtoken";
import { client } from "@repo/src/client";
import { Prisma } from "../../../packages/db/src/generated/prisma";


const wss = new WebSocketServer({ port: 8080 });


interface User {
  ws: WebSocket;
  rooms: string[]; // it s room name
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
  const url = request.url;    // what they r trying to connect to eg ws://localhost:3000?token=123123
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
    // this data is usually into string hence we need to parse it into json.
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
      // send roomId and type = join room

      // check if this slug even exist or not in our database slow..
      const r = await client.room.findUnique({
        where: { id: Number(parsedData.roomId) },   
        select: { id: true },
      }); // returns null if no room [web:43][web:55]


      if (!r) {
        // optionally send error back to client
        socket.send(JSON.stringify({ type: "error", message: "roomId not found" }));
        return;
      }
      //includes checks whether the user is already in that roomId.
      //If the room is not in the list, it adds parsedData.roomId to user.rooms
      if (!user.rooms.includes(parsedData.roomId)) {
        user.rooms.push(parsedData.roomId);
      }
    }


if (parsedData.type === "leave_room") {
  const user = users.find((x) => x.ws === socket);
  if (!user) {
    console.log("User not found for given socket");
    return;
  }
  user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
}

  if (parsedData.type === "chat") {
    // type chat,slug and message
      const roomId = parsedData.roomId;
      const message = parsedData.message;

     // use queue here
      await client.chat.create({
        data:{
          message,
          roomId:Number(roomId),
          userId
        }
      })

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type:"chat",
                userId,
                roomId,
                message: message,
                timestamp: new Date().toISOString(),
              })
            );
        }
      });
    }
  });


  socket.on("close", () => {
    const index = users.findIndex((x) => x.ws === socket);
    if (index !== -1) users.splice(index, 1);
  });
}); 