import express, { Router } from "express"
import { Middleware } from "../../middleware,";
const router:Router = express.Router();
import {client} from "@repo/src/client"
import { CreateRoomSchema } from "@repo/common/types";

router.post("/room",Middleware,async (req,res)=>{
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
        await client.room.create({
            data:{
                slug:parsedData.data.name,
                adminId: userId
            }
        })
        
        res.json({
            roomId:12323
        })
    }
    catch{
        res.status(400).json({
            msg:"name already present kidnly choose another name"
        })

    }

})

export default router;

