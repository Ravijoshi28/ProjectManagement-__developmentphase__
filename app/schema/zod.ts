
import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const ProjectSchema = z.object({
 
    name:z.string().min(3),
    image:z.string().nullable().optional(),
    about:z.string(),
    memberId:z.array(z.string()).default([]),
    });

export const TaskSchema = z.object({

  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum([
    "High Priority",
    "Medium Priority",
    "Low Priority",
  ]),
  status: z.enum([
    "To Do",
    "In Progress",
    "Review",
    "Completed",
  ]),
  dueDate: z.coerce.date(),
  assignedTo: z.string().nullable().optional(),
  watchers: z.array(z.string()).default([]).optional(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const MemberSchema = z.object({
 projectId:z.string(),
  userId:z.string(),
  role: z.enum(["owner","member"])
  
});



export const MessageSchema = z
  .object({
    content: z.string().optional().default(""),

    type: z.enum(["text", "file", "system"]),

    file: z
      .object({
        url: z.string(),
        mimeType: z.string(),
      })
      .nullable()
      .optional(),
  })
  .refine(
    (data) =>
      data.content.trim().length > 0 || data.file != null,
    {
      message: "Either message content or a file is required",
      path: ["content"],
    }
  );