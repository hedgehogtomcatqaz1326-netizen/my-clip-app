"use client";

import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <Header />

      <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-6 text-sm text-center">
        ログインすると、設定が自動的に保存されます。
      </div>

      {/* アプリ本体のコンテンツ */}
      <div className="space-y-4">
        {/* ここに既存のクリップボード項目（姓、名、住所など）が入ります */}
      </div>
    </main>
  );
}