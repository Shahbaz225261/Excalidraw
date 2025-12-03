import { BACKEND_URL } from "../../config";
import axios from "axios";
import ChatRoom from "../../../components/ChatRoom";

async function getRoomId(slug: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    console.log("roomid is: " + response.data.roomId);
    return response.data.roomId;
  } catch (error) {
    console.log("error hai: ");
    console.log(error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
  // if you ever need ?searchParams, also make it a Promise
  // searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ChatRoomPage({ params }: PageProps) {
  const { slug } = await params;        // 👈 IMPORTANT: await here
  const userId = await getRoomId(slug);
  console.log("userId:", userId);

  return <ChatRoom id={userId} />;
}
