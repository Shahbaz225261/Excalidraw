"use client"
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
            // Canvas itself is empty ,getContext("2d") gives you a 2D drawing tool ,ctx = your pen/brush
            const ctx = canvas.getContext("2d");
            if(!ctx){
                return;
            }
            let clicked = false;
            let startX =0;
            let startY =0;
            // i will create a full black rectangle whoch we don't want
            // ctx.fillRect(25,25,100,100);
            // it will create a rectangle like a excalidraw
            // ctx.strokeRect(25,25,100,100);

            // jab mouse down hoga uski pos bataega and then jb up kroge uski but we also want pos of when we move mouse
            canvas.addEventListener("mousedown",(e)=>{
                clicked = true;
                startX = e.clientX;
                startY = e.clientY;
            })
            canvas.addEventListener("mouseup",(e)=>{
                clicked = false;
                console.log(e.clientX);
                console.log(e.clientY);
            })
            // it will give position when we move mouse but we want jab ham press krre and move krre then
            // pos show ho naak only moove krne par hence we use clicked variable which is not a good practice to use
            canvas.addEventListener("mousemove",(e)=>{
                if(clicked){
                    //coordinates are viewport-based, not canvas-based, so you must convert them.
                    const width  = e.clientX - startX;
                    const height = e.clientY - startY;
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    ctx.strokeRect(startX,startY,width,height);
                }
            })
        }

    },[canvasRef])
    return <div>
       <canvas ref = {canvasRef} width="800" height="600"></canvas>
    </div>
}