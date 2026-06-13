"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, Download, Trash2, Music2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Song = {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  audioUrl: string;
  duration: number;
  createdAt: string;
};

export default function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/songs")
      .then((r) => r.json())
      .then((data) => setSongs(Array.isArray(data) ? data : []))
      .catch(() => toast.error("楽曲の読み込みに失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  const togglePlay = (song: Song) => {
    if (playingId === song.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(song.audioUrl);
      audio.play();
      audio.onended = () => setPlayingId(null);
      audioRef.current = audio;
      setPlayingId(song.id);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSongs((prev) => prev.filter((s) => s.id !== id));
      if (playingId === id) {
        audioRef.current?.pause();
        setPlayingId(null);
      }
      toast.success("削除しました");
    } else {
      toast.error("削除に失敗しました");
    }
  };

  const formatDate = (str: string) => new Date(str).toLocaleDateString("ja-JP");
  const formatDuration = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">ライブラリ</h1>
        <p className="text-muted-foreground text-sm">生成した楽曲の一覧</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Music2 className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm">まだ楽曲がありません</p>
          <p className="text-xs mt-1">生成ページから楽曲を作成してみましょう</p>
        </div>
      ) : (
        <div className="space-y-3">
          {songs.map((song) => (
            <Card key={song.id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <Button variant="outline" size="icon" className="w-9 h-9 shrink-0 mt-0.5" onClick={() => togglePlay(song)}>
                    {playingId === song.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{song.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{song.prompt}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {song.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      <span className="text-xs text-muted-foreground ml-auto">{formatDuration(song.duration)} · {formatDate(song.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <a href={song.audioUrl} download>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(song.id)}>
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
