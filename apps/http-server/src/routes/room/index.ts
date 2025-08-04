import express, { Router } from "express"
import { Middleware } from "../../middleware,";
const router:Router = express.Router();
import {client} from "@repo/src/client"
import { CreateRoomSchema } from "@repo/common/types";

router.post("/CreateRoom",Middleware,async (req,res)=>{
    const parsedData = CreateRoomSchema.safeParse(req.body)
    if(!parsedData.success){
        return res.status(400).json({
            msg:"Incorrect inputs"
        })
    }
    const userId = req.userId
    if(userId == undefined){
        return res.status(400).json({
            msg:"invalid admit id"
        })
    }
    try{
        const user = await client.room.create({
            data:{
                slug:parsedData.data.name,
                adminId: userId
            }
        })
        res.json({
            roomId:user.id
        })
    }
    catch{
        res.status(400).json({
            msg:"slug need to be unique kindly choose another slug"
        })
    }
})

router.get("/chats/:roomId",async (req,res)=>{
  const roomId = Number(req.params.roomId);
  const messages = await client.chat.findMany({
    where:{
      roomId:roomId
    },
    orderBy:{
      id:"desc"
    },
    take:50
  })
  res.json({
    messages
  })
})

  



export default router;

