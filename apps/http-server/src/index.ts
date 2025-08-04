import express from "express"
const app = express();
const port = 4000;
app.use(express.json())

import userRouter from "./routes/user"
app.use("/user",userRouter)

import roomRouter from "./routes/room"
app.use("/room",roomRouter)

app.listen(port);