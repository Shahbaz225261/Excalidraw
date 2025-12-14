"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function Dashboard(){
    const router = useRouter();
    const [roomId,setRoomId] = useState("");
    return <div>
        <input placeholder="enter slug" type="text" onChange={(e)=>{
            setRoomId(e.target.value);
        }} />
        <button onClick={()=>{
            router.push(`/room/${roomId}`);
        }}>join room</button>
    </div>
}