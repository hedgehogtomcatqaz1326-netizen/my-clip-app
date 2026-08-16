"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [items, setItems] = useState([
    { id: "1", label: "姓", value: "山田" },
    { id: "2", label: "名", value: "太郎" },
    { id: "3", label: "セイ", value: "ヤマダ" },
    { id: "4", label: "メイ", value: "タロウ" },
    { id: "5", label: "自宅住所", value: "東京都千代田区大手町1-1-1" },
    { id: "6", label: "電話番号", value: "090-0000-9999" },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("my_info_clipboard");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <header className="pb-4 border-b mb-6">
        <h1 className="text-2xl font-bold">マイ情報クリップボード</h1>
      </header>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
          >
            <div>
              <div className="text-xs text-gray-500">{item.label}</div>
              <div className="text-base font-bold text-gray-800">{item.value}</div>
            </div>
            <button
              onClick={() => copyToClipboard(item.value)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-bold hover:bg-emerald-700"
            >
              コピー
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}