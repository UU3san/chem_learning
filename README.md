# 中学化学｜電池とイオン 学習Webアプリ Ver.1

中学生向けの「イオン・イオン化・ボルタ電池・ダニエル電池」を、アニメーションと確認テストで学ぶWeb教材です。

## 主な機能
- スマホ / タブレット / PC対応
- イオン化アニメーション
- ボルタ電池の電子移動・水素発生アニメーション
- ダニエル電池の電子移動・銅析出アニメーション
- Web Speech APIを使った日本語読み上げ
- 5問の確認テスト
- 間違えた問題だけ再テスト
- 外部ライブラリ不要

## GitHub Pagesへの公開手順
1. GitHubで新しいRepositoryを作成
2. このフォルダの `index.html`, `style.css`, `app.js` をRepository直下へアップロード
3. GitHubの `Settings` → `Pages`
4. `Build and deployment` の Source を `Deploy from a branch`
5. Branch を `main`、Folder を `/(root)` にして保存
6. 数分後、表示されたURLを開く

## ローカルで確認
`index.html` をブラウザで直接開いても動きます。
音声読み上げはブラウザによって挙動が異なる場合があります。

## ファイル
- `index.html` … 画面
- `style.css` … デザインとアニメーション
- `app.js` … 操作・読み上げ・確認テスト

## 今後の拡張案
- 生徒名 / ユーザー登録
- 学習履歴の保存
- 間違い問題の永続保存
- 問題追加用JSON
- 教師用管理画面
- Firebase / Supabase連携
