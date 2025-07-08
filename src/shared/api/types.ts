// API 共通型定義
// TODO: 実装予定
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}
