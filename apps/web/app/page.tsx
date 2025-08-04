"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface FormData {
  roomId: string;
}

export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    mode: "onChange",
  });
  const router = useRouter();


  const onSubmit = (data: FormData) => {
    router.push(`/room/${data.roomId}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          padding: 30,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          minWidth: 320,
        }}
      >
        <input
          type="text"
          placeholder="Enter room slug"
          {...register("roomId", {
            required: "Room ID is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
            maxLength: { value: 20, message: "Maximum 20 characters" },
            pattern: {
              value: /^[a-zA-Z0-9_-]+$/,
              message: "Only letters, numbers, _ and - allowed",
            },
          })}
          style={{
            padding: 12,
            borderRadius: 8,
            border: errors.roomId ? "2px solid #e53e3e" : "2px solid #ccc",
            outline: "none",
            fontSize: 16,
          }}
        />
        {errors.roomId && (
          <span style={{ color: "#e53e3e", fontSize: 14 }}>
            {errors.roomId.message}
          </span>
        )}
        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 8,
            border: "none",
            backgroundColor: "#667eea",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          Enter Room
        </button>
      </form>
    </div>
  );
}
