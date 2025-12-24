"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { IconButton } from "./IconButton";

// Define enum for shapes
enum Shape {
    CIRCLE = "circle",
    PENCIL = "pencil", 
    RECT   = "rect"
}

export function Canvas({
    roomId,
    socket
}:{
    socket: WebSocket,
    roomId:string
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Shape>(Shape.CIRCLE);

    useEffect(()=>{
        if(canvasRef.current){
            //@ts-ignore
            window.selectedTool = selectedTool;
        }

    },[selectedTool]);

    
    useEffect(()=>{
        if(canvasRef.current){
            const canvas = canvasRef.current;
            initDraw(canvasRef.current, roomId, socket);
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
    selectedTool: Shape,
    setSelectedTool: (s: Shape) => void
}) {
    return (
        <div className="fixed top-2 left-2 flex gap-2">
            <IconButton
                Activated={selectedTool === Shape.PENCIL}
                icon={<Pencil />} 
                onClick={() => {
                    setSelectedTool(Shape.PENCIL);
                }} 
            />
            <IconButton 
                Activated={selectedTool === Shape.RECT}
                icon={<RectangleHorizontalIcon />} 
                onClick={() => {
                    setSelectedTool(Shape.RECT);
                }} 
            />
            <IconButton 
                Activated={selectedTool === Shape.CIRCLE}
                icon={<Circle />} 
                onClick={() => {
                    setSelectedTool(Shape.CIRCLE);
                }} 
            />
        </div>
    )
}