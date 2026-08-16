import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "ログイン",
      credentials: {
        email: { label: "メールアドレス", type: "email", placeholder: "admin@example.com" },
        password: { label: "パスワード", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials?.email === "admin@example.com" &&
          credentials?.password === "password123"
        ) {
          return { id: "1", name: "管理者ユーザー", email: "admin@example.com" };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };