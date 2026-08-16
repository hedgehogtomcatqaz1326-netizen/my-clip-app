"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Copy, Check, LogIn, LogOut, Plus, Trash2, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";

interface InfoItem {
  id: string;
  label: string;
  value: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<InfoItem[]>([
    { id: "1", label: "姓", value: "山田" },
    { id: "2", label: "名", value: "太郎" },
    { id: "3", label: "セイ", value: "ヤマダ" },
    { id: "4", label: "メイ", value: "タロウ" },
    { id: "5", label: "自宅住所", value: "東京都千代田区大手町1-1-1" },
    { id: "6", label: "電話番号", value: "090-0000-9999" },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setErrorMessage("クリップボードへのコピーに失敗しました。ブラウザのアクセス許可を確認してください。");
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) {
      setErrorMessage("ラベルと内容の両方を入力してください。");
      return;
    }
    const newItem: InfoItem = {
      id: Date.now().toString(),
      label,
      value,
    };
    setItems([...items, newItem]);
    setLabel("");
    setValue("");
    setErrorMessage(null);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const [movedItem] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, movedItem);
    setItems(newItems);
  };

  if (status === "loading") {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <main className="max-w-xl mx-auto p-4 min-h-screen">
      <header className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-xl font-bold">マイ情報クリップボード</h1>
        {session ? (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded"
          >
            <LogOut size={16} /> ログアウト
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-1 text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded"
          >
            <LogIn size={16} /> Googleでログイン
          </button>
        )}
      </header>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-2 text-sm">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}

      {!session && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded text-sm">
          Googleアカウントでログインすると、設定が自動的に保存されます。
        </div>
      )}

      <div className="space-y-3 mb-8">
        {items.map((item, index) => (
          <div key={item.id} className="p-3 border rounded-lg bg-white shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <button
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-700 disabled:opacity-20 p-0.5"
                  title="上に移動"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === items.length - 1}
                  className="text-gray-400 hover:text-gray-700 disabled:opacity-20 p-0.5"
                  title="下に移動"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">{item.label}</p>
                <p className="text-base text-gray-800 font-medium">{item.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(item.id, item.value)}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded font-bold"
              >
                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === item.id ? "コピー完了" : "コピー"}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-400 hover:text-red-600 p-1"
                title="削除"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="p-4 bg-gray-50 rounded-lg border space-y-3">
        <h2 className="text-sm font-bold text-gray-700">新しい項目を追加</h2>
        <div>
          <input
            type="text"
            placeholder="ラベル (例: フリガナ)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="内容 (例: ヤマダ タロウ)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-900 text-white text-sm py-2 rounded font-medium"
        >
          <Plus size={16} /> 追加する
        </button>
      </form>
    </main>
  );
}