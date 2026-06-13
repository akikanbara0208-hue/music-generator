"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, ExternalLink, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useUser();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setHasKey(data.hasApiKey));
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      if (res.ok) {
        setSaved(true);
        setHasKey(true);
        setApiKey("");
        toast.success("APIキーを保存しました");
        setTimeout(() => setSaved(false), 2000);
      } else {
        toast.error("保存に失敗しました");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">設定</h1>
        <p className="text-muted-foreground text-sm">APIキーと各種設定を管理します</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ElevenLabs APIキー</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasKey && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <Check className="w-4 h-4" />
                APIキーが設定されています
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              音楽生成にはElevenLabsのAPIキーが必要です。無料プランから商用利用可能です。
            </p>
            <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              ElevenLabsでAPIキーを取得する
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">{hasKey ? "APIキーを更新する" : "APIキーを入力"}</label>
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10 font-mono text-sm"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowKey(!showKey)}>
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button onClick={handleSave} disabled={!apiKey.trim() || saving || saved} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4" />保存しました</> : "保存する"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">アカウント</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">メールアドレス</p>
              <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
