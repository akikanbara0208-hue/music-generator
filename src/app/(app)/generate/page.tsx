"use client";

import { useState } from "react";
import { Sparkles, Loader2, Play, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const MOOD_TAGS = [
  "明るい", "暗い", "エネルギッシュ", "落ち着いた", "ロマンティック",
  "緊張感", "神秘的", "懐かしい", "楽しい", "切ない",
];

const GENRE_TAGS = [
  "ポップ", "ロック", "ジャズ", "クラシック", "EDM",
  "ヒップホップ", "R&B", "アコースティック", "アンビエント", "シネマティック",
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generated, setGenerated] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && selectedTags.length === 0) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));
    setIsGenerating(false);
    setGenerated(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">音楽を生成</h1>
        <p className="text-muted-foreground text-sm">
          雰囲気やジャンルを入力して楽曲を生成します
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Textarea
            placeholder="例：夏の夕暮れ、海辺でゆったりと流れるような曲。明るくて少し切ない雰囲気で。"
            className="min-h-28 resize-none text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">ムード</p>
          <div className="flex flex-wrap gap-2">
            {MOOD_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">ジャンル</p>
          <div className="flex flex-wrap gap-2">
            {GENRE_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          className="w-full gap-2"
          onClick={handleGenerate}
          disabled={isGenerating || (!prompt.trim() && selectedTags.length === 0)}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              生成する
            </>
          )}
        </Button>

        {generated && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-sm">生成された楽曲</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {prompt || selectedTags.join(", ")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>

              <div className="h-1.5 bg-secondary rounded-full mb-4">
                <div className="h-full w-1/3 bg-primary rounded-full" />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>0:43</span>
                <span>2:10</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 flex-1">
                  <Download className="w-3.5 h-3.5" />
                  ダウンロード
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  ライブラリに保存
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
