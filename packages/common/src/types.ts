import zod from "zod";

export const SignupSchema = zod.object({
  name : zod.string(),
  username: zod.string()
  .email({ message: "Invalid email address" }),
  
  password: zod.string()
    .min(4, { message: "Password must be at least 9 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
});

export const SigninSchema = zod.object({
   username: zod.string()
    .email({ message: "Invalid email address" }),
  
  password: zod.string()
    .min(4, { message: "Password must be at least 9 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
})

export const CreateRoomSchema = zod.object({
  name:zod.string().min(3).max(20)
})
