import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const songs = pgTable("songs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  tags: text("tags").array().default([]),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  userId: text("user_id").primaryKey(),
  elevenLabsApiKey: text("elevenlabs_api_key"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
