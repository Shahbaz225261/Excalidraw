import { BACKEND_URL } from "../../config";
import axios from "axios"
import  ChatRoom  from "../../../components/ChatRoom";

async function getRoomId(slug:string){
    try{
        const response =  await axios.get(`${BACKEND_URL}/room/${slug}`)
        console.log("roomid is: " + response.data.roomId);
        return response.data.roomId;
    }
    catch(error){
        console.log("error hai: ");
        console.log(error);
        return null;
    }
    
}

export default async function ChatRoom1({params}:{
    params:{
        slug:string
    }
}){
    const slug   = (await params).slug;
    const userId = await getRoomId(slug);
    console.log(userId);

    return <ChatRoom id = {userId}  />

}