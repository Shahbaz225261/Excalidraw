import express from "express"
import cors from "cors";

const app = express();
app.use(cors());
const port = 4000;
app.use(express.json())

import userRouter from "./routes/user"
app.use("/user",userRouter)

import roomRouter from "./routes/room"
app.use("/room",roomRouter)

app.listen(port);