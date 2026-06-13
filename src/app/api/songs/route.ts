import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { songs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userSongs = await db
    .select()
    .from(songs)
    .where(eq(songs.userId, userId))
    .orderBy(desc(songs.createdAt));

  return NextResponse.json(userSongs);
}
