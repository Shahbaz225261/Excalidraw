export function initDraw(canvas:HTMLCanvasElement){
            // Canvas itself is empty ,getContext("2d") gives you a 2D drawing tool ,ctx = your pen/brush
            const ctx = canvas.getContext("2d");
            if(!ctx){
                return;
            }
            // by defualt the colour of canvas should be black
            ctx.fillStyle = "rgba(0,0,0)";
            ctx.fillRect(0,0,canvas.width,canvas.height);

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
            // pos show ho naaki only moove krne par hence we use clicked variable which is not a good practice to use
            canvas.addEventListener("mousemove",(e)=>{
                if(clicked){
                    //coordinates are viewport-based, not canvas-based, so you must convert them.
                    const width  = e.clientX - startX;
                    const height = e.clientY - startY;
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    // Sets the fill color to black This does nothing by itself It only tells the canvas: “If I fill something next, use black color
                    ctx.fillStyle = "rgba(0,0,0)";
                    ctx.fillRect(0,0,canvas.width,canvas.height);
                    ctx.strokeStyle = "rgba(255,255,255)";
                    ctx.strokeRect(startX,startY,width,height);
                }
            })

}