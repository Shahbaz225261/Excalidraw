import express, { Router } from "express"
const router:Router = express.Router();
import {SignupSchema} from "@repo/common/types"

router.post("/signup",(req,res)=>{

    res.send("hii")

})
router.post("signin",(req,res)=>{
    res.send("hii")
    
})

export default router;