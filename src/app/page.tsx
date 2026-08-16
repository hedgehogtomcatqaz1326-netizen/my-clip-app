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

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [openItemIds, setOpenItemIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("my_info_clipboard_v7");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const saveItems = (newItems: Item[]) => {
    setItems(newItems);
    localStorage.setItem("my_info_clipboard_v7", JSON.stringify(newItems));
  };

  // --- 追加した関数群 ---
  const toggleItemOpen = (id: string) => {
    setOpenItemIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    const index = items.findIndex((i) => i.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    saveItems(updated);
  };

  const onDragStart = (id: string) => setDraggedItemId(id);
  const onDragEnter = (targetId: string) => {
    if (draggedItemId === targetId) return;
    const fromIndex = items.findIndex((i) => i.id === draggedItemId);
    const toIndex = items.findIndex((i) => i.id === targetId);
    const updated = [...items];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    saveItems(updated);
  };

  return (
    <main className="max-w-2xl mx-auto p-4 pb-24">
      <h1 className="text-xl font-bold mb-6">マイ情報クリップボード</h1>
      
      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat}>
            <h2 className="text-xs font-bold text-gray-400 mb-2">{cat}</h2>
            <div className="space-y-2">
              {items.filter(i => i.tag === cat).map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => onDragStart(item.id)}
                  onDragEnter={() => onDragEnter(item.id)}
                  onDragEnd={() => setDraggedItemId(null)}
                  className={`border rounded-lg bg-white p-3 flex items-center gap-3 shadow-sm ${
                    draggedItemId === item.id ? "opacity-30 border-blue-500" : ""
                  }`}
                >
                  <div className="cursor-grab text-gray-300 hover:text-gray-600 select-none text-xl">⋮⋮</div>
                  
                  <div className="flex-1 min-w-0" onClick={() => toggleItemOpen(item.id)}>
                    <div className="text-xs font-bold text-gray-500">{item.label}</div>
                    <div className="text-sm font-mono font-bold truncate">
                      {item.isMasked ? "••••••••" : item.value}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button onClick={() => moveItem(item.id, "up")} className="p-2 bg-gray-100 rounded">↑</button>
                    <button onClick={() => moveItem(item.id, "down")} className="p-2 bg-gray-100 rounded">↓</button>
                    <button onClick={() => deleteItem(item.id)} className="p-2 text-red-500">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}