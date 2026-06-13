import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId));

  return NextResponse.json({ hasApiKey: !!settings?.elevenLabsApiKey });
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { apiKey } = await req.json();
  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 400 });

  await db
    .insert(userSettings)
    .values({ userId, elevenLabsApiKey: apiKey })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: { elevenLabsApiKey: apiKey, updatedAt: new Date() },
    });

  return NextResponse.json({ success: true });
}
