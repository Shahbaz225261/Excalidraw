import express, { Router } from "express";
import { SignupSchema } from "@repo/common/types";
import { SigninSchema } from "@repo/common/types";
import { JWT_SECRET } from "@repo/backend-common/index";
import jwt, { sign } from "jsonwebtoken";
import { client } from "@repo/src/client";
import bcrypt from "bcrypt";

const router: Router = express.Router();

router.post("/signup", async (req, res) => {
  const parsedData = SignupSchema.safeParse(req.body);
  if(!parsedData.success){
    console.log(parsedData)
    return res.status(400).json({
      msg:"Incorrect inputs"
    })
  }
  try {
    const existingUser = await client.user.findFirst({
      where: { email: parsedData.data?.username },
    });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
    const user = await client.user.create({
      data: {
        email: parsedData.data?.username,
        password: hashedPassword,
        name :    parsedData.data.name
      },
    });

    return res.status(200).json({
      msg: "User signed up successfully",
      userId: user.id
   });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }

});

router.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body)
  if(!parsedData.success){
    return res.status(400).json({
      msg:"Incorrect input"
    })
  }
  try {
    const user = await client.user.findFirst({
      where: { email: parsedData.data.username },
    });

    if (!user) {
      return res.status(400).json({ msg: "User not found. Please sign up." });
    }

    const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    return res.status(200).json({
      msg: "Signed in successfully",
      token,
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});



export default router;
