import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "babi@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(process.env.API_URL + '/auth', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.email,
            password: credentials?.password,
          }),
        });

        if(!res.ok) {
          const resBody = await res.text()
          throw new Error(resBody)
        }

        const user = await res.json();

        if (user && user.role === 'ADMIN') {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
    error: '/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };