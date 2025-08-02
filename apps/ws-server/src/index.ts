import { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/index";
import jwt, { JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket, request) => {
  const url = request.url;
  if (!url) return socket.close(1008, "Missing URL");

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");

  if (!token || typeof token !== "string") {
    return socket.close(1008, "Missing or invalid token");
  }

  let decoded: JwtPayload & { userId: string };

  try {
    const result = jwt.verify(token, JWT_SECRET);
    if (typeof result !== "object" || !("userId" in result)) {
      return socket.close(1008, "Invalid token payload");
    }
    decoded = result as JwtPayload & { userId: string };
  } catch (err) {
    return socket.close(1008, "Invalid or expired token");
  }

  const { userId } = decoded;

  socket.on("message", (message) => {
    console.log(`[${userId}]: ${message.toString()}`);
  });
});
