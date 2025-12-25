import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    points: { x: number; y: number }[]; // Multiple points for smooth drawing
} | {
    type: "line";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle";
    private pencilPoints: { x: number; y: number }[] = []; // Store current pencil points
    private currentPencilShape: Shape | null = null; // Track current pencil drawing
    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.roomId = roomId;
        this.socket = socket;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: "circle" | "pencil" | "rect" | "line") {
        this.selectedTool = tool;
    }

    // we made seperate init fuction to write logic because constructor can't be async
    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape.shape);
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0,0,0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.forEach((shape) => {
            if (!shape) return; // skip undefined shapes
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255,255,255)";
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
            else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2)
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if (shape.type === "pencil") {
                this.drawPencilShape(shape);
            }
            else if (shape.type === "line") {
                this.ctx.beginPath();
                this.ctx.moveTo(shape.x1, shape.y1);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        });
    }

    // Helper method to draw pencil shapes
    private drawPencilShape(shape: Shape) {
        if (shape.type !== "pencil" || shape.points.length < 2) return;

        this.ctx.strokeStyle = "rgba(255,255,255)";
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        
        this.ctx.beginPath();
        
        // Move to first point
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        
        // Draw lines to all other points
        for (let i = 1; i < shape.points.length; i++) {
            this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.closePath();
        
        // Reset line properties
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = "butt";
        this.ctx.lineJoin = "miter";
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        
        // For pencil tool, initialize points array
        if (this.selectedTool === "pencil") {
            this.pencilPoints = [{ x: this.startX, y: this.startY }];
        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        if (!this.clicked) return;
        
        this.clicked = false;
        const rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;

        if (selectedTool == "rect") {
            const width = endX - this.startX;
            const height = endY - this.startY;
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        }
        else if (selectedTool == "circle") {
            const width = endX - this.startX;
            const height = endY - this.startY;
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
            const centerX = this.startX + (width / 2);
            const centerY = this.startY + (height / 2);
            shape = {
                type: "circle",
                radius: radius,
                centerX: centerX,
                centerY: centerY,
            }
        }
        else if (selectedTool == "pencil") {
            // Add final point if not already added
            if (this.pencilPoints.length > 0) {
                const lastPoint = this.pencilPoints[this.pencilPoints.length - 1];
                if (lastPoint.x !== endX || lastPoint.y !== endY) {
                    this.pencilPoints.push({ x: endX, y: endY });
                }
            }
            
            // Only create shape if we have enough points
            if (this.pencilPoints.length >= 2) {
                shape = {
                    type: "pencil",
                    points: [...this.pencilPoints] // Copy the points array
                }
            }
            
            // Clear temporary pencil points
            this.pencilPoints = [];
            this.currentPencilShape = null;
        }
        else if (selectedTool == "line") {
            shape = {
                type: "line",
                x1: this.startX,
                y1: this.startY,
                x2: endX,
                y2: endY
            }
        }

        if (!shape) {
            return;
        }
        
        this.existingShapes.push(shape);
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }));
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (!this.clicked) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        if (this.selectedTool === "pencil") {
            // Add point to pencil drawing
            this.pencilPoints.push({ x: currentX, y: currentY });
            
            // Create temporary shape for current pencil drawing
            this.currentPencilShape = {
                type: "pencil",
                points: [...this.pencilPoints]
            };
        }

        // Clear and redraw canvas with current state
        this.clearCanvas();
        
        // Draw current drawing (if any)
        if (this.selectedTool === "rect") {
            const width = currentX - this.startX;
            const height = currentY - this.startY;
            this.ctx.strokeStyle = "rgba(255,255,255)";
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        }
        else if (this.selectedTool === "circle") {
            const width = currentX - this.startX;
            const height = currentY - this.startY;
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
            const centerX = this.startX + (width / 2);
            const centerY = this.startY + (height / 2);
            
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();
        }
        else if (this.selectedTool === "pencil" && this.currentPencilShape) {
            // Draw current pencil shape
            this.drawPencilShape(this.currentPencilShape);
        }
        else if (this.selectedTool === "line") {
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(currentX, currentY);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)
        this.canvas.addEventListener("mouseup", this.mouseUpHandler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)
    }
};