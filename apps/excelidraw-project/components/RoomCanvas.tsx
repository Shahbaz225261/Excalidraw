"use client";
import { WS_URL } from "@/config";
import { useEffect,useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
        // after u signed in this toekn should come from local storage for now we r just hardcoding this
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhOGEzZDQwZS03Njc0LTRhNjYtOTQ2OC03MTgzNzhjZTYyZDMiLCJpYXQiOjE3NjU4Njk3Njl9.EEcg2mfhctdXTJWSf7SXpZDQ2kEE5VgGRVz0OzjA0zA`);
            
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