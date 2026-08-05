export interface User{
       _id: string;
    username: string;
    name:string;
    email: string;
    image?: string | null;
    password: string;
    createdAt: Date;
}


export interface projectMembers{
    _id:string;
    role:"owner" | "member";
    userId:string;
    projectId:string;
    joinedAt:Date;
}

export interface Projects{
    _id:string
    name:string;
    image?:string | null;
    about:string;
    memberId:string[];
    createdAt:Date;
    ownerId:string
}

export interface Tasks{
    _id:string;
    projectId:string;
        title:string;
        description:string;
        priority:
            "High Priority" |"Medium Priority"|"Low Priority";
       
            status:
            "To Do"|"In Progress"|"Review"|"Completed";
        dueDate:Date;
        completedAt:Date;
        assignedTo:string |null;
        watchers:string[] |null
}

export interface Notifications{
    _id:string;
    taskId:string;
    projectId:string;
    seen:boolean;
    sender:string;
    senderId:string;
    userId:string;
    type:"task_assigned"|
        "task_updated"|
        "project_invite";
    message:string;
    title:string;
    createdAt:Date
}

export interface Message {
  _id: string;
  projectId: string;
  senderId: string;
  content: string;
  type: "text" | "file" | "system";
  file?: {
    url: string;
    mimeType: string;
  } | null;

  edited?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Gemini{
    _id:string;
    userId:string;
    text:string;
      type: "text" | "file" | "system";
     file?: {
    url: string;
    mimeType: string;
  } | null;
  response:string;
  createdAt?: Date;

}