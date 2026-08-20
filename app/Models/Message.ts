import { db } from "../lib/astradb";
import type { Message } from "./typeValidator";

export const messages=db.collection<Message>("messages");
