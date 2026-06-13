import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { songs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [song] = await db
    .select()
    .from(songs)
    .where(and(eq(songs.id, id), eq(songs.userId, userId)));

  if (!song) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const publicId = song.audioUrl.split("/").pop()?.split(".")[0];
  if (publicId) {
    await cloudinary.uploader.destroy(`music-generator/${publicId}`, { resource_type: "video" });
  }

  await db.delete(songs).where(eq(songs.id, id));

  return NextResponse.json({ success: true });
}
