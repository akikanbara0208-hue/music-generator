# 要件定義: Music Generation App

## プロダクト概要

SUNOライクな音楽生成Webアプリ。クリエイター向けに「雰囲気テキスト」から楽曲を生成できるツール。

## ビジネスモデル

**BYOK（Bring Your Own Key）モデル**
- ユーザーが自分のElevenLabs APIキーを取得・設定して使用
- API利用料はユーザー自身が直接ElevenLabsに支払う
- 開発者のAPIコスト負担なし
- ElevenLabsのFreeプランから商用利用可能なため、ユーザーの初期コスト$0

## ターゲットユーザー

クリエイター（BGM制作・効果音・楽曲制作等）

## プラットフォーム

Webアプリ（ブラウザ）

## 機能要件

| # | 機能 | 詳細 |
|---|------|------|
| 1 | テキストから音楽生成 | ジャンル・雰囲気・歌詞などのプロンプトを入力して楽曲生成 |
| 2 | ライブラリ管理 | 生成した楽曲の保存・一覧・検索・削除 |
| 3 | ダウンロード | MP3/WAV形式でエクスポート |
| 4 | ユーザー認証 | サインアップ/ログイン、マイページ |
| 5 | APIキー設定 | ElevenLabsのAPIキー取得リンク付き入力UI |

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | React + TypeScript + Vite |
| スタイリング | Tailwind CSS + shadcn/ui |
| バックエンド | Next.js (API Routes) |
| 認証 | Supabase Auth |
| DB・ストレージ | Supabase (PostgreSQL + Storage) |
| 音楽生成API | ElevenLabs（ユーザー自身のAPIキーを使用） |

## 音楽生成API

**ElevenLabs**
- 商用利用: Freeプランから全プランOK
- 料金: ユーザー負担（Freeで月10,000クレジット）
- 入力: テキストプロンプト（ジャンル・雰囲気・歌詞）
