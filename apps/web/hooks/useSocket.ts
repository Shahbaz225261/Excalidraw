"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export default function useSocket(){
    const [loading,setLoading] = useState(true);
    const [socket,setSocket] = useState<WebSocket>();
    
    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YmM4NjQ1MS02ODdhLTQyNmUtOWRmZC02ODY2MDA0NmE4Y2QiLCJpYXQiOjE3NjU1MzYxOTd9.znvEnYb8mH0TLLwdqRP93Y0b4kSST_5U-1uTHdmftJQ`);
        ws.onopen = ()=>{
            setLoading(false);
            setSocket(ws);
        }
    },[]);
    return {
        socket,
        loading
    }
}