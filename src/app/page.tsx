"use client";

import { useState, useEffect } from "react";

type Item = {
  id: string;
  label: string;
  value: string;
  tag: string;
  isMasked: boolean;
};

const CATEGORIES = ["基本情報", "ログイン・パスワード", "その他"];

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newTag, setNewTag] = useState("基本情報");
  const [newIsMasked, setNewIsMasked] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openItemIds, setOpenItemIds] = useState<Record<string, boolean>>({});

  // 1. 初期データロード（整合性維持）
  useEffect(() => {
    const saved = localStorage.getItem("my_info_clipboard_stable");
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // デフォルトデータ
      setItems([
        { id: "1", label: "姓", value: "山田", tag: "基本情報", isMasked: false },
        { id: "2", label: "名", value: "太郎", tag: "基本情報", isMasked: false },
      ]);
    }
  }, []);

  // 2. データ保存関数（状態更新の基盤）
  const saveItems = (newItems: Item[]) => {
    setItems(newItems);
    localStorage.setItem("my_info_clipboard_stable", JSON.stringify(newItems));
  };

  // 3. ロジック関数群（各ボタン機能の担保）
  const toggleItemOpen = (id: string) => {
    setOpenItemIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const toggleMask = (id: string) => {
    saveItems(items.map((item) => (item.id === id ? { ...item, isMasked: !item.isMasked } : item)));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newValue.trim()) return;
    const newItem: Item = { id: Date.now().toString(), label: newLabel, value: newValue, tag: newTag, isMasked: newIsMasked };
    saveItems([...items, newItem]);
    setNewLabel("");
    setNewValue("");
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    saveItems(updated);
  };

  const setAllItemsOpen = (isOpen: boolean) => {
    const newState: Record<string, boolean> = {};
    items.forEach((item) => (newState[item.id] = isOpen));
    setOpenItemIds(newState);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">マイ情報クリップボード</h1>

      {/* コントロールパネル */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button onClick={() => setAllItemsOpen(true)} className="px-3 py-1 bg-gray-200 rounded text-xs font-bold">全開く</button>
          <button onClick={() => setAllItemsOpen(false)} className="px-3 py-1 bg-gray-200 rounded text-xs font-bold">全閉じる</button>
        </div>
      </div>

      {/* 入力フォーム */}
      <form onSubmit={addItem} className="bg-slate-50 p-4 rounded-lg border mb-8 space-y-3">
        <input type="text" placeholder="項目名" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="w-full p-2 border rounded text-sm" />
        <input type="text" placeholder="内容" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="w-full p-2 border rounded text-sm" />
        <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded text-sm">項目を追加</button>
      </form>

      {/* リスト表示 */}
      {CATEGORIES.map((cat) => (
        <div key={cat} className="mb-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase mb-2">{cat}</h2>
          {items.filter(i => i.tag === cat).map((item) => {
            const globalIndex = items.findIndex(i => i.id === item.id);
            const isOpen = !!openItemIds[item.id];
            return (
              <div key={item.id} className="border rounded-lg p-3 mb-2 bg-white shadow-sm">
                <div className="flex justify-between items-center" onClick={() => toggleItemOpen(item.id)}>
                  <span className="font-bold text-sm cursor-pointer">{item.label}</span>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => moveItem(globalIndex, "up")} className="px-2 py-1 bg-gray-100 rounded text-xs">↑</button>
                    <button onClick={() => moveItem(globalIndex, "down")} className="px-2 py-1 bg-gray-100 rounded text-xs">↓</button>
                    <button onClick={() => deleteItem(item.id)} className="px-2 py-1 text-red-500 text-xs">✕</button>
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="font-mono text-sm break-all mb-2">{item.isMasked ? "••••••••" : item.value}</div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleMask(item.id)} className="px-2 py-1 border rounded text-xs">{item.isMasked ? "👁️" : "🙈"}</button>
                      <button onClick={() => copyToClipboard(item.value, item.id)} className="px-4 py-1 bg-emerald-600 text-white rounded text-xs font-bold">{copiedId === item.id ? "完了!" : "コピー"}</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </main>
  );
}