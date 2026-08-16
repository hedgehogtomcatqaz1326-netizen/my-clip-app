"use client";

import { useState, useEffect, useRef } from "react";

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

  // 各項目IDごとの折りたたみ状態
  const [openItemIds, setOpenItemIds] = useState<Record<string, boolean>>({});

  // ドラッグ操作用の参照
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

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
    const newItem: Item = {
      id: newId,
      label: newLabel,
      value: newValue,
      tag: newTag,
      isMasked: newIsMasked,
    };
    saveItems([...items, newItem]);
    
    // 追加した項目は自動で開く
    setOpenItemIds((prev) => ({ ...prev, [newId]: true }));

    setNewLabel("");
    setNewValue("");
    setNewIsMasked(false);
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const toggleMask = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isMasked: !item.isMasked } : item
    );
    saveItems(updated);
  };

  // 個別項目の開閉トグル
  const toggleItemOpen = (id: string) => {
    setOpenItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 全項目の開閉を一括切り替え
  const setAllItemsOpen = (isOpen: boolean) => {
    const newState: Record<string, boolean> = {};
    items.forEach((item) => {
      newState[item.id] = isOpen;
    });
    setOpenItemIds(newState);
  };

  // 上下移動ボタンによる並び替え
  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    saveItems(updated);
  };

  // ドラッグ＆ドロップ処理
  const handleDragStart = (index: number, id: string) => {
    dragItem.current = index;
    setDraggingId(id);
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      const updated = [...items];
      const [draggedItemContent] = updated.splice(dragItem.current, 1);
      updated.splice(dragOverItem.current, 0, draggedItemContent);
      saveItems(updated);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingId(null);
  };

  return (
    <main className="max-w-2xl mx-auto p-6 pb-24">
      <header className="pb-4 border-b mb-4">
        <h1 className="text-2xl font-bold text-gray-800">マイ情報クリップボード</h1>
      </header>

      {/* 一括開閉＆並び替えヒント */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm py-3 border-b mb-6 z-10 flex items-center justify-between">
        <div className="text-xs text-gray-500 font-bold">
          ドラッグ（⋮⋮）または矢印（↑↓）で並び替え可能
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAllItemsOpen(true)}
            className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-bold transition-colors"
          >
            全開く
          </button>
          <button
            onClick={() => setAllItemsOpen(false)}
            className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-bold transition-colors"
          >
            全閉じる
          </button>
        </div>
      </div>

      {/* 新規項目追加フォーム */}
      <form onSubmit={addItem} className="bg-slate-50 p-4 rounded-lg border mb-8 space-y-3">
        <h2 className="text-sm font-bold text-gray-700">新しい項目を追加</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="項目名（例: 姓, 電話番号, パスワード）"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="p-2 border rounded text-sm w-full bg-white"
          />
          <input
            type="text"
            placeholder="内容（例: 山田, 090-0000-0000）"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="p-2 border rounded text-sm w-full bg-white"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <select
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="p-2 border rounded text-sm bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={newIsMasked}
                onChange={(e) => setNewIsMasked(e.target.checked)}
                className="rounded"
              />
              伏字（マスク）で保存する
            </label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded text-sm hover:bg-blue-700 transition-colors"
          >
            項目を追加
          </button>
        </div>
      </form>

      {/* カテゴリごとのリスト */}
      <div className="space-y-6">
        {CATEGORIES.map((cat) => {
          const categoryItems = items.filter((item) => item.tag === cat);
          if (categoryItems.length === 0) return null;

          return (
            <div key={cat} className="space-y-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                {cat}
              </h2>

              <div className="space-y-2">
                {categoryItems.map((item) => {
                  const globalIndex = items.findIndex((i) => i.id === item.id);
                  const isOpen = !!openItemIds[item.id];
                  const isDragging = draggingId === item.id;

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(globalIndex, item.id)}
                      onDragEnter={() => handleDragEnter(globalIndex)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      className={`border rounded-lg bg-white shadow-xs overflow-hidden transition-all ${
                        isDragging ? "opacity-40 border-blue-400 bg-blue-50" : "hover:border-slate-300"
                      }`}
                    >
                      {/* 項目のヘッダー */}
                      <div className="flex items-center justify-between p-2.5 bg-slate-50 border-b border-slate-100">
                        {/* ドラッグ用ハンドル & ラベル */}
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span
                            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 select-none text-base font-bold px-1"
                            title="ドラッグして並び替え"
                          >
                            ⋮⋮
                          </span>
                          <button
                            onClick={() => toggleItemOpen(item.id)}
                            className="text-left font-bold text-slate-800 text-sm truncate flex-1"
                          >
                            {item.label}
                          </button>
                        </div>

                        {/* 上下移動ボタン & 開閉トグル */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <div className="flex bg-white border rounded overflow-hidden">
                            <button
                              onClick={() => moveItem(globalIndex, "up")}
                              disabled={globalIndex === 0}
                              className="px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 border-r"
                              title="上へ移動"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveItem(globalIndex, "down")}
                              disabled={globalIndex === items.length - 1}
                              className="px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                              title="下へ移動"
                            >
                              ↓
                            </button>
                          </div>

                          <button
                            onClick={() => toggleItemOpen(item.id)}
                            className="p-1 text-xs text-slate-400 font-bold hover:text-slate-600"
                          >
                            {isOpen ? "▲" : "▼"}
                          </button>
                        </div>
                      </div>

                      {/* 閉じている時の事前表示（簡易値） */}
                      {!isOpen && (
                        <div
                          onClick={() => toggleItemOpen(item.id)}
                          className="px-3 py-1.5 text-xs text-gray-400 font-mono truncate cursor-pointer hover:bg-slate-50/50"
                        >
                          {item.isMasked ? "••••••••" : item.value}
                        </div>
                      )}

                      {/* 開いている時の詳細コンテンツ */}
                      {isOpen && (
                        <div className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t">
                          <div className="text-base font-bold text-gray-800 font-mono break-all">
                            {item.isMasked ? "••••••••" : item.value}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <button
                              onClick={() => toggleMask(item.id)}
                              className="p-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded border"
                              title={item.isMasked ? "表示する" : "隠す"}
                            >
                              {item.isMasked ? "👁️ 表示" : "🙈 隠す"}
                            </button>

                            <button
                              onClick={() => copyToClipboard(item.value, item.id)}
                              className={`px-3 py-1.5 text-white rounded text-sm font-bold transition-colors ${
                                copiedId === item.id
                                  ? "bg-gray-700"
                                  : "bg-emerald-600 hover:bg-emerald-700"
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
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}