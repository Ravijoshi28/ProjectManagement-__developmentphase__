import { db } from "../lib/astradb";
import { projectMembers } from "./typeValidator";

export const pMembers = db.collection<projectMembers>("pMembers");
