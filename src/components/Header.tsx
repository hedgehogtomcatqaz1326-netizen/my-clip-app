"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center pb-4 border-b mb-6">
      <h1 className="text-2xl font-bold">マイ情報クリップボード</h1>
      {session ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{session.user?.email}</span>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 font-medium"
          >
            ログアウト
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-bold"
        >
          ログイン
        </button>
      )}
    </header>
  );
}