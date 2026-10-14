import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        await connectDB();
        const email = (credentials.email as string).toLowerCase().trim();
        const user = await User.findOne({ email });
        if (!user || !user.password) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) {
          return null;
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "customer",
          phone: user.phone || "",
          address: user.address || "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "customer";
        token.phone = (user as any).phone || "";
        token.address = (user as any).address || "";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).phone = token.phone as string;
        (session.user as any).address = token.address as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
