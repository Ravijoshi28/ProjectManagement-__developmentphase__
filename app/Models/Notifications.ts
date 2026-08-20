import { db } from "../lib/astradb";
import type { Notifications } from "./typeValidator";

export const notifications=db.collection<Notifications>("notifications")
