"use client";

import { useState } from "react";
import { Play, Pause, Download, Trash2, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_SONGS = [
  { id: "1", title: "夏の夕暮れ", prompt: "夏の夕暮れ、海辺でゆったりと流れるような曲", tags: ["明るい", "アコースティック"], duration: "2:10", createdAt: "2026-06-13" },
  { id: "2", title: "深夜のジャズ", prompt: "深夜のバーで流れる落ち着いたジャズ", tags: ["落ち着いた", "ジャズ"], duration: "3:05", createdAt: "2026-06-12" },
  { id: "3", title: "Epic Battle", prompt: "壮大なバトルシーン、緊張感のあるオーケストラ", tags: ["緊張感", "シネマティック"], duration: "2:48", createdAt: "2026-06-11" },
];

export default function LibraryPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = (id: string) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">ライブラリ</h1>
        <p className="text-muted-foreground text-sm">生成した楽曲の一覧</p>
      </div>

      {MOCK_SONGS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Music2 className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm">まだ楽曲がありません</p>
          <p className="text-xs mt-1">生成ページから楽曲を作成してみましょう</p>
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_SONGS.map((song) => (
            <Card key={song.id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-9 h-9 shrink-0 mt-0.5"
                    onClick={() => togglePlay(song.id)}
                  >
                    {playingId === song.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{song.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {song.prompt}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {song.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {song.duration}
                      </span>
                    </div>

                    {playingId === song.id && (
                      <div className="mt-3 h-1 bg-secondary rounded-full">
                        <div className="h-full w-1/4 bg-primary rounded-full transition-all" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
