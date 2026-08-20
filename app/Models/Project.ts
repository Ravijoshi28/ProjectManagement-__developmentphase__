import { db } from "../lib/astradb"
import type { Projects } from "./typeValidator"

export const projects=db.collection<Projects>("projects");
