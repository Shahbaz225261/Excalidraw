"use client"
import { useEffect, useState } from "react";
import  useSocket  from "../hooks/useSocket";

export default function ChatRoomClient({
    messages,
    id
}:{
    messages:{message:string}[],
    id:string
}){
    const {socket,loading} = useSocket();
    const [chats,setChats] = useState(messages);
    const[currentMessage,setCurrentMessage]  = useState("");

    useEffect(()=>{
        if(socket && !loading){
            socket.send(JSON.stringify({
                type:"joinRoom",
                roomId:id
            }))
            socket.onmessage = (event) =>{
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat"){
                    setChats(c=>[...c,{message:parsedData.message}]);
                }
            }
        }
        
    },[socket,loading,id]);

    return <div>
       {chats.map(m =>  <div>{m.message}</div> )}
        <input value={currentMessage} onChange={(e)=>{
            setCurrentMessage(e.target.value);
        }} type="text" />
        
        <button onClick={()=>{
            socket?.send(JSON.stringify({
                type:"chat",
                roomId:id,
                message:currentMessage
            }))
        setChats((prevChats) => [...prevChats, { message: currentMessage }]);
        setCurrentMessage("");
        }}> Send Message</button>
    </div>
}