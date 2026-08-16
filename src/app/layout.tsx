import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "マイ情報クリップボード",
  description: "ワンタップで個人情報をコピーできるツール",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}