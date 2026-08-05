import { db } from "../lib/astradb";
import type { Gemini } from "./typeValidator";

export const geminiModel=db.collection<Gemini>("geminiModel");
 