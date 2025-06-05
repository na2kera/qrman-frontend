# ステージ1: ビルド環境
FROM node:20-slim AS build

WORKDIR /app

# package.json と package-lock.json* があればコピーし、依存関係をインストール
# package-lock.jsonがない場合は npm install のみ実行される
COPY package.json ./
COPY package-lock.json* ./
RUN npm install

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# ステージ2: 本番環境
FROM nginx:stable-alpine

# ビルドステージで生成されたdistディレクトリをNginxの公開ディレクトリにコピー
COPY --from=build /app/dist /usr/share/nginx/html

# Nginxの設定ファイルをコピー (カスタム設定が必要な場合)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# ポート80を公開
EXPOSE 80

# Nginxをフォアグラウンドで起動
CMD ["nginx", "-g", "daemon off;"]