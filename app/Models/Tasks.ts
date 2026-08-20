import { db } from "../lib/astradb";

import { Tasks } from "./typeValidator";

export const tasks=db.collection<Tasks>("tasks");
