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

  useEffect(() => {
    const saved = localStorage.getItem("my_info_clipboard_v3");
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
    localStorage.setItem("my_info_clipboard_v3", JSON.stringify(newItems));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newValue.trim()) return;
    const newItem: Item = {
      id: Date.now().toString(),
      label: newLabel,
      value: newValue,
      tag: newTag,
      isMasked: newIsMasked,
    };
    saveItems([...items, newItem]);
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

  // 指定のカテゴリ場所へスクロール
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`cat-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 pb-24">
      <header className="pb-4 border-b mb-4">
        <h1 className="text-2xl font-bold text-gray-800">マイ情報クリップボード</h1>
      </header>

      {/* クイックジャンプタグ（タップでその位置へジャンプ） */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm py-3 border-b mb-6 z-10">
        <div className="text-xs text-gray-500 mb-1.5 font-bold">ワンタップでジャンプ:</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-slate-700 active:scale-95 transition-all"
            >
              ↓ {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 新規項目追加フォーム */}
      <form onSubmit={addItem} className="bg-slate-50 p-4 rounded-lg border mb-8 space-y-3">
        <h2 className="text-sm font-bold text-gray-700">新しい項目を追加</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="項目名（例: メールのパスワード）"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="p-2 border rounded text-sm w-full bg-white"
          />
          <input
            type="text"
            placeholder="内容（例: pass1234）"
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

      {/* カテゴリごとの一覧 */}
      <div className="space-y-8">
        {CATEGORIES.map((cat) => {
          const categoryItems = items.filter((item) => item.tag === cat);
          return (
            <div key={cat} id={`cat-${cat}`} className="scroll-mt-20">
              <div className="flex items-center gap-2 mb-3 border-b pb-1">
                <span className="text-sm font-bold text-slate-700">{cat}</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {categoryItems.length}件
                </span>
              </div>

              <div className="space-y-3">
                {categoryItems.length === 0 ? (
                  <div className="text-xs text-gray-400 py-2">項目がありません</div>
                ) : (
                  categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 font-medium truncate">
                          {item.label}
                        </div>
                        <div className="text-base font-bold text-gray-800 truncate font-mono">
                          {item.isMasked ? "••••••••" : item.value}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleMask(item.id)}
                          className="p-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded border"
                          title={item.isMasked ? "表示する" : "隠す"}
                        >
                          {item.isMasked ? "👁️" : "🙈"}
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
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}