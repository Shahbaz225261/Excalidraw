"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react"

export default function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        // when it renders first time then its value will be null 
        // to tab ye logic ni run hona chaiye (only phli baar)
        // then canvasRef have value of canvas then again this will mount and run the logic
        if(canvasRef.current){
            // storing canvas reference into canvas variable
            const canvas = canvasRef.current;
            initDraw(canvas);
        }

    },[canvasRef])
    return <div>
       <canvas ref = {canvasRef} width="2000" height="900"></canvas>
    </div>
}