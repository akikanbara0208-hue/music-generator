"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, Play, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const MOOD_TAGS = ["明るい", "暗い", "エネルギッシュ", "落ち着いた", "ロマンティック", "緊張感", "神秘的", "懐かしい", "楽しい", "切ない"];
const GENRE_TAGS = ["ポップ", "ロック", "ジャズ", "クラシック", "EDM", "ヒップホップ", "R&B", "アコースティック", "アンビエント", "シネマティック"];

type Song = {
  id: string;
  title: string;
  prompt: string;
  audioUrl: string;
  duration: number;
};

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [song, setSong] = useState<Song | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && selectedTags.length === 0) return;
    setIsGenerating(true);
    setSong(null);
    setIsPlaying(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tags: selectedTags }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "ElevenLabs API key not set") {
          toast.error("設定ページでElevenLabsのAPIキーを設定してください");
        } else {
          toast.error(data.error || "生成に失敗しました");
        }
        return;
      }

      setSong(data);
      toast.success("楽曲を生成しました");
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !song) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    setProgress(duration ? (currentTime / duration) * 100 : 0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">音楽を生成</h1>
        <p className="text-muted-foreground text-sm">雰囲気やジャンルを入力して楽曲を生成します</p>
      </div>

      <div className="space-y-6">
        <Textarea
          placeholder="例：夏の夕暮れ、海辺でゆったりと流れるような曲。明るくて少し切ない雰囲気で。"
          className="min-h-28 resize-none text-sm"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">ムード</p>
          <div className="flex flex-wrap gap-2">
            {MOOD_TAGS.map((tag) => (
              <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} className="cursor-pointer select-none" onClick={() => toggleTag(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">ジャンル</p>
          <div className="flex flex-wrap gap-2">
            {GENRE_TAGS.map((tag) => (
              <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} className="cursor-pointer select-none" onClick={() => toggleTag(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Button className="w-full gap-2" onClick={handleGenerate} disabled={isGenerating || (!prompt.trim() && selectedTags.length === 0)}>
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" />生成中（最大30秒かかります）</>
          ) : (
            <><Sparkles className="w-4 h-4" />生成する</>
          )}
        </Button>

        {song && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              {song.audioUrl && (
                <audio
                  ref={audioRef}
                  src={song.audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />
              )}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-sm">{song.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{song.prompt}</p>
                </div>
                <Button variant="outline" size="icon" className="w-8 h-8" onClick={togglePlay}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>

              <div className="h-1.5 bg-secondary rounded-full mb-2 cursor-pointer" onClick={(e) => {
                if (!audioRef.current) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                audioRef.current.currentTime = ratio * audioRef.current.duration;
              }}>
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}</span>
                <span>{formatTime(song.duration)}</span>
              </div>

              <div className="flex gap-2">
                <a href={song.audioUrl} download className="flex-1">
                  <Button variant="outline" size="sm" className="gap-2 w-full">
                    <Download className="w-3.5 h-3.5" />ダウンロード
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
