"use client";

import { useState, useEffect } from "react";

type Item = {
  id: string;
  label: string;
  value: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([
    { id: "1", label: "姓", value: "山田" },
    { id: "2", label: "名", value: "太郎" },
    { id: "3", label: "セイ", value: "ヤマダ" },
    { id: "4", label: "メイ", value: "タロウ" },
    { id: "5", label: "自宅住所", value: "東京都千代田区大手町1-1-1" },
    { id: "6", label: "電話番号", value: "090-0000-9999" },
  ]);

  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 初回読み込み（ローカルストレージから取得）
  useEffect(() => {
    const saved = localStorage.getItem("my_info_clipboard_data");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // データ更新時にローカルストレージに自動保存
  const saveItems = (newItems: Item[]) => {
    setItems(newItems);
    localStorage.setItem("my_info_clipboard_data", JSON.stringify(newItems));
  };

  // コピー機能
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // 新規追加
  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newValue.trim()) return;
    const newItem: Item = {
      id: Date.now().toString(),
      label: newLabel,
      value: newValue,
    };
    saveItems([...items, newItem]);
    setNewLabel("");
    setNewValue("");
  };

  // 削除
  const deleteItem = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  // 順番移動（上へ）
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    saveItems(newItems);
  };

  // 順番移動（下へ）
  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    saveItems(newItems);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <header className="pb-4 border-b mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">マイ情報クリップボード</h1>
      </header>

      {/* 新規項目追加フォーム */}
      <form onSubmit={addItem} className="bg-gray-50 p-4 rounded-lg border mb-6 space-y-3">
        <h2 className="text-sm font-bold text-gray-700">新しい項目を追加</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="項目名（例: メールのパスワード）"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="p-2 border rounded text-sm w-full"
          />
          <input
            type="text"
            placeholder="内容（例: pass1234）"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="p-2 border rounded text-sm w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-bold rounded text-sm hover:bg-blue-700"
        >
          項目を追加する
        </button>
      </form>

      {/* クリップボード一覧 */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm gap-2"
          >
            {/* 上下並び替えボタン */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="text-xs px-1 py-0.5 border rounded bg-gray-100 disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1}
                className="text-xs px-1 py-0.5 border rounded bg-gray-100 disabled:opacity-30"
              >
                ▼
              </button>
            </div>

            {/* ラベルと内容 */}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 truncate">{item.label}</div>
              <div className="text-base font-bold text-gray-800 truncate">{item.value}</div>
            </div>

            {/* アクション（コピー・削除） */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(item.value, item.id)}
                className={`px-3 py-1.5 text-white rounded text-sm font-bold transition-colors ${
                  copiedId === item.id ? "bg-gray-700" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {copiedId === item.id ? "完了!" : "コピー"}
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}