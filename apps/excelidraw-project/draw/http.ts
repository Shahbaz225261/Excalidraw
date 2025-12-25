import { BACKEND_URL } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId:string){
    const res = await axios.get(`${BACKEND_URL}/room/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes  = messages.map((x:{message:string}) =>{
        // db return string hence we convert it nto json because we will store json in db. like {type:"rect",x:1,y:3,w:2,h:2}
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })
    return shapes;
}
