
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../lib/prisma";

const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing credentials", credentials);
          return null;
        }
        
        try {
          // Find user by email
          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user) {
            console.log("[Auth] User not found", credentials.email);
            return null;
          }
          // Compare password
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            console.log("[Auth] Invalid password for", credentials.email);
            return null;
          }
          console.log("[Auth] Login success", user.email);
          // Return user object (without password)
          return { id: user.id.toString(), name: user.name, email: user.email };
        } catch (error) {
          console.error("[Auth] Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
};

export default authOptions;
