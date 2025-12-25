"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { IconButton } from "./IconButton";
import { Game } from "@/draw/Game";

// Define enum for Tools
export type Tool  = "circle" | "rect" | "pencil" ;

export function Canvas({
    roomId,
    socket
}:{
    socket: WebSocket,
    roomId:string
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game,setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle");

    useEffect(()=>{
        if(canvasRef.current){
            game?.setTool(selectedTool);
        }

    },[selectedTool,game]);

    
    useEffect(()=>{
        if(canvasRef.current){
            const canvas = canvasRef.current;
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () =>{
                g.destroy();
            }
        }

    },[canvasRef])

    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
}

export function Topbar({
    selectedTool,
    setSelectedTool
}:{
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return (
        <div className="fixed top-2 left-2 flex gap-2">
            <IconButton
                Activated={selectedTool === "pencil"}
                icon={<Pencil />} 
                onClick={() => {
                    setSelectedTool("pencil");
                }} 
            />
            <IconButton 
                Activated={selectedTool === "rect"}
                icon={<RectangleHorizontalIcon />} 
                onClick={() => {
                    setSelectedTool("rect");
                }} 
            />
            <IconButton 
                Activated={selectedTool === "circle"}
                icon={<Circle />} 
                onClick={() => {
                    setSelectedTool("circle");
                }} 
            />
        </div>
    )
}