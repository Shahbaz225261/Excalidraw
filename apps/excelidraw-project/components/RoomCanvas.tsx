"use client";
import { WS_URL } from "@/config";
import { useEffect,useRef, useState } from "react";
import { Canvas } from "./Canvas";
import { useRouter } from "next/navigation";


export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket] = useState<WebSocket | null>(null);
    const router = useRouter();

     useEffect(()=>{
        // Get token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
            console.error("No token found in localStorage. Redirecting to signin...");
            // Redirect to signin page after a delay
            setTimeout(() => {
                router.push("/signin");
            }, 2000);
            return;
        }
        // after u signed in this toekn should come from local storage for now we r just hardcoding this
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
            
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"joinRoom",
                roomId
            }))
        }
    },[])

    if(!socket){
        return <div>
            Connecting to server...........
        </div>
    }

    return <div>
        <Canvas  roomId = {roomId} socket = {socket}/>
    </div>
}