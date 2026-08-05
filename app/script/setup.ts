import "dotenv/config";
import { db } from "@/app/lib/astradb";
async function setup() {
  // await db.createCollection("users");
  // await db.createCollection("projects");
  // await db.createCollection("tasks");
  // await db.createCollection("messages");
  // await db.createCollection("notifications");
  // await db.createCollection("pMembers");
  await db.createCollection("geminiModel")

  console.log("Collections created");
}

setup().catch(console.error);