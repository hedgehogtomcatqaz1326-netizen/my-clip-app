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
  const [items, setItems] = useState<Item[]>([
    { id: "1", label: "姓", value: "山田", tag: "基本情報", isMasked: false },
    { id: "2", label: "名", value: "太郎", tag: "基本情報", isMasked: false },
    { id: "3", label: "自宅住所", value: "東京都千代田区大手町1-1-1", tag: "基本情報", isMasked: false },
    { id: "4", label: "電話番号", value: "090-0000-9999", tag: "基本情報", isMasked: false },
    { id: "5", label: "ログインパスワード", value: "P@ssw0rd1234", tag: "ログイン・パスワード", isMasked: true },
  ]);

  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newTag, setNewTag] = useState("基本情報");
  const [newIsMasked, setNewIsMasked] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openItemIds, setOpenItemIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("my_info_clipboard_v6");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveItems = (newItems: Item[]) => {
    setItems(newItems);
    localStorage.setItem("my_info_clipboard_v6", JSON.stringify(newItems));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newValue.trim()) return;
    const newId = Date.now().toString();
    const newItem: Item = { id: newId, label: newLabel, value: newValue, tag: newTag, isMasked: newIsMasked };
    saveItems([...items, newItem]);
    setOpenItemIds((prev) => ({ ...prev, [newId]: true }));
    setNewLabel("");
    setNewValue("");
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const toggleMask = (id: string) => {
    saveItems(items.map((item) => (item.id === id ? { ...item, isMasked: !item.isMasked } : item)));
  };

  const toggleItemOpen = (id: string) => {
    setOpenItemIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setAllItemsOpen = (isOpen: boolean) => {
    const newState: Record<string, boolean> = {};
    items.forEach((item) => (newState[item.id] = isOpen));
    setOpenItemIds(newState);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    saveItems(updated);
  };

  return (
    <main className="max-w-2xl mx-auto p-6 pb-24">
      <header className="pb-4 border-b mb-4">
        <h1 className="text-2xl font-bold text-gray-800">マイ情報クリップボード</h1>
      </header>

      <div className="sticky top-0 bg-white/90 backdrop-blur-sm py-3 border-b mb-6 z-10 flex items-center justify-between">
        <div className="text-xs text-gray-500 font-bold">並び替え：上下ボタン</div>
        <div className="flex gap-2">
          <button onClick={() => setAllItemsOpen(true)} className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-bold">全開く</button>
          <button onClick={() => setAllItemsOpen(false)} className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-bold">全閉じる</button>
        </div>
      </div>

      <form onSubmit={addItem} className="bg-slate-50 p-4 rounded-lg border mb-8 space-y-3">
        <h2 className="text-sm font-bold text-gray-700">新しい項目を追加</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input type="text" placeholder="項目名" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="p-2 border rounded text-sm w-full bg-white" />
          <input type="text" placeholder="内容" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="p-2 border rounded text-sm w-full bg-white" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <select value={newTag} onChange={(e) => setNewTag(e.target.value)} className="p-2 border rounded text-sm bg-white">
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded text-sm hover:bg-blue-700">項目を追加</button>
        </div>
      </form>

      <div className="space-y-6">
        {CATEGORIES.map((cat) => {
          const categoryItems = items.filter((item) => item.tag === cat);
          if (categoryItems.length === 0) return null;
          return (
            <div key={cat} className="space-y-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">{cat}</h2>
              {categoryItems.map((item) => {
                const globalIndex = items.findIndex((i) => i.id === item.id);
                const isOpen = !!openItemIds[item.id];
                return (
                  <div key={item.id} className="border rounded-lg bg-white shadow-xs overflow-hidden">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 border-b">
                      <button onClick={() => toggleItemOpen(item.id)} className="text-left font-bold text-slate-800 text-sm truncate flex-1">{item.label}</button>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <div className="flex bg-white border rounded overflow-hidden">
                          <button onClick={() => moveItem(globalIndex, "up")} disabled={globalIndex === 0} className="px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 border-r">↑</button>
                          <button onClick={() => moveItem(globalIndex, "down")} disabled={globalIndex === items.length - 1} className="px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30">↓</button>
                        </div>
                        <button onClick={() => toggleItemOpen(item.id)} className="p-1 text-xs text-slate-400 font-bold">{isOpen ? "▲" : "▼"}</button>
                      </div>
                    </div>
                    {!isOpen && <div onClick={() => toggleItemOpen(item.id)} className="px-3 py-1.5 text-xs text-gray-400 font-mono truncate cursor-pointer">{item.isMasked ? "••••••••" : item.value}</div>}
                    {isOpen && (
                      <div className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t">
                        <div className="text-base font-bold text-gray-800 font-mono break-all">{item.isMasked ? "••••••••" : item.value}</div>
                        <div className="flex items-center gap-2 self-end shrink-0">
                          <button onClick={() => toggleMask(item.id)} className="p-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded border">{item.isMasked ? "👁️ 表示" : "🙈 隠す"}</button>
                          <button onClick={() => copyToClipboard(item.value, item.id)} className={`px-3 py-1.5 text-white rounded text-sm font-bold ${copiedId === item.id ? "bg-gray-700" : "bg-emerald-600"}`}>{copiedId === item.id ? "完了!" : "コピー"}</button>
                          <button onClick={() => deleteItem(item.id)} className="px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded">削除</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </main>
  );
}