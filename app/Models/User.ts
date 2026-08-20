import { db } from "../lib/astradb";

import type { User } from "./typeValidator";

export const users=db.collection<User>("users")
