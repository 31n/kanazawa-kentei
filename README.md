# マークシート — 汎用クイズWebアプリ

CSV/JSON形式の問題集を読み込んで遊べる、4択クイズアプリです。ユーザー登録不要、GitHub Pages / Netlifyで静的ホスティングできます。

## 開発・動作確認

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

`dist/` フォルダに静的ファイルが出力されます。`vite.config.js` で `base: './'` を指定しているため、GitHub Pagesの `https://<user>.github.io/<repo名>/` 配下でもリポジトリ名に関係なくそのまま動作します。

## GitHub Pagesへのデプロイ例

1. `npm run build` で `dist/` を生成
2. `dist/` の中身を `gh-pages` ブランチにpush（または GitHub Actions で自動化）
3. リポジトリの Settings → Pages で公開ブランチ/フォルダを設定

検索避けとして `index.html` に `noindex` メタタグ、`public/robots.txt` に `Disallow: /` を設定済みです。

## 問題集の追加方法

1. `public/data/presets/` に新しいJSONファイルを追加
2. `public/data/manifest.json` に以下の形式でエントリを追記

```json
{
  "id": "quiz-id",
  "title": "表示名",
  "description": "任意の説明文",
  "file": "data/presets/your-file.json"
}
```

### 問題集JSONのスキーマ

```json
[
  {
    "id": "q001",
    "question": "問題文",
    "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
    "answer": 0,
    "category": "任意のカテゴリ名",
    "explanation": "任意。不正解時に「答えを見る」で表示される解説"
  }
]
```

- `answer` は0始まり（0=選択肢1 〜 3=選択肢4）
- `category` / `explanation` は省略可能
- ユーザーが自分のJSONファイルをアプリ内からアップロードして遊ぶこともできます（ブラウザ内で処理、外部送信なし）

## 正答率の記録について

- 通算正答率・直近15問の正答率は、問題集ごとに端末のlocalStorageへ保存されます
- 別の端末・ブラウザには引き継がれません
- 「直近15問」は無制限モードで解答した分のみ記録されます（10問/20問/全問モードは通算正答率にのみ反映）

## 出題モード

- 10問 / 20問 / 全問 / 無制限
- 無制限モードは問題集を最後まで解くと自動的にシャッフルし直して継続し、いつでも「終了する」ボタンで結果画面に進めます
