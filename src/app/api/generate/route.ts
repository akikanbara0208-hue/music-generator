import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { songs, userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt, tags } = await req.json();
  if (!prompt && (!tags || tags.length === 0)) {
    return NextResponse.json({ error: "Prompt or tags required" }, { status: 400 });
  }

  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId));

  if (!settings?.elevenLabsApiKey) {
    return NextResponse.json({ error: "ElevenLabs API key not set" }, { status: 400 });
  }

  const fullPrompt = [prompt, ...(tags || [])].filter(Boolean).join(", ");

  const elevenRes = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
    method: "POST",
    headers: {
      "xi-api-key": settings.elevenLabsApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: fullPrompt,
      duration_seconds: 22,
      prompt_influence: 0.3,
    }),
  });

  if (!elevenRes.ok) {
    const err = await elevenRes.json().catch(() => ({}));
    return NextResponse.json({ error: "ElevenLabs error", detail: err }, { status: 502 });
  }

  const audioBuffer = await elevenRes.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString("base64");
  const dataUri = `data:audio/mpeg;base64,${base64Audio}`;

  const uploadRes = await cloudinary.uploader.upload(dataUri, {
    resource_type: "video",
    folder: "music-generator",
    format: "mp3",
  });

  const title = prompt
    ? prompt.slice(0, 30) + (prompt.length > 30 ? "..." : "")
    : tags.join(", ");

  const [song] = await db
    .insert(songs)
    .values({
      userId,
      title,
      prompt: prompt || "",
      tags: tags || [],
      audioUrl: uploadRes.secure_url,
      duration: Math.round(uploadRes.duration || 22),
    })
    .returning();

  return NextResponse.json(song);
}
