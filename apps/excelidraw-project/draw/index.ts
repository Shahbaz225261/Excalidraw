import axios from "axios";
import { BACKEND_URL } from "@/config";
type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
};


export async function initDraw(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
            // Canvas itself is empty ,getContext("2d") gives you a 2D drawing tool ,ctx = your pen/brush
            const ctx = canvas.getContext("2d");
            // here even if i draw anything the existing shapes will appear on canvas by default
            let existingShapes:Shape[] = await getExistingShapes(roomId);
            if(!ctx){
                return;
            }
            socket.onmessage = (event)=>{
                const message = JSON.parse(event.data);


                if(message.type == "chat") {
                    const parsedShape = JSON.parse(message.message)
                    existingShapes.push(parsedShape.shape);
                    clearCanvas(ctx,canvas,existingShapes);
                }
            }


            clearCanvas(ctx,canvas,existingShapes);
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
                // when this mouse up happen the i need to broadcast this shape to everyone
                clicked = false;
                const width  = e.clientX - startX;
                const height = e.clientY - startY;
                const shape:Shape = {
                    type :"rect",
                    x:startX,
                    y:startY,
                    height,
                    width
                }
                if(!shape){
                    return;
                }
                existingShapes.push(shape)


                socket.send(JSON.stringify({
                    type:"chat",
                    message : JSON.stringify({
                        shape
                    }),
                    roomId
                }))
            })
            // it will give position when we move mouse but we want jab ham press krre and move krre then
            // pos show ho naaki only moove krne par hence we use clicked variable which is not a good practice to use
            canvas.addEventListener("mousemove",(e)=>{
                if(clicked){
                    //coordinates are viewport-based, not canvas-based, so you must convert them.
                    const width  = e.clientX - startX;
                    const height = e.clientY - startY;
                    clearCanvas(ctx,canvas,existingShapes);
                    // jab ham new shape banaenge then ham clear krenge everything and also rerendered everything again
                    // other than the shape u r  i m also rendering the existing shapes . and when mous eis up then s shape will
                    // also stored into the shapes variable
                    ctx.strokeStyle = "rgba(255,255,255)";
                    ctx.strokeRect(startX,startY,width,height);
                }
            })
}


function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, existingShapes: Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach((shape) => {
        if (!shape) return; // skip undefined shapes
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    });
}



async function getExistingShapes(roomId:string){
    const res = await axios.get(`${BACKEND_URL}/room/chats/${roomId}`);
    const messages = res.data.messages;


    const shapes  = messages.map((x:{message:string}) =>{
        // db return string hence we convert it nto json because we will store json in db. like {type:"rect",x:1,y:3,w:2,h:2}
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })
    return shapes;
}
