import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export default function useSocket(){
    const [loading,setLoading] = useState(true);
    const [socket,setSocket]  =useState<WebSocket>();
    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxODk5MmVmZC00ZDlmLTQ5YzItYWIxYy0wYjIzYTE5MDlmMzIiLCJpYXQiOjE3NTQzMDMzODB9.5r3CgkpDjyos9YVMYJMHBUam0VvglW69RAfjZcVNV1I`);
        ws.onopen=()=>{
            setLoading(false);
            setSocket(ws);
        }
    },[])
    return {
        socket,
        loading
    }
}