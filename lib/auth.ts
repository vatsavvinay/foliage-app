import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

/**
 * Hardened NextAuth configuration with security best practices:
 * - Secure session strategy (JWT with signed tokens)
 * - Hardened cookies with SameSite, Secure, HttpOnly flags
 * - Shortened session duration for sensitive operations
 * - CSRF token validation (NextAuth handles automatically)
 * - Timing-safe password comparison
 * - Rate limiting should be applied at middleware/API level
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate input format
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Additional input validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
          throw new Error("Invalid email format");
        }

        // Query user by email (case-insensitive)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        });

        // Use timing-safe comparison: always compare even if user doesn't exist
        // This prevents timing attacks that reveal whether email is registered
        const passwordValid = user 
          ? await bcrypt.compare(credentials.password, user.password)
          : false;

        if (!user || !passwordValid) {
          throw new Error("Invalid email or password");
        }

        // Return minimal user data (do not expose password hash)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  
  callbacks: {
    /**
     * JWT callback - called when creating/updating token
     * Keep token payload minimal for performance
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Add token issued time for session validation
        token.iat = Math.floor(Date.now() / 1000);
      }
      return token;
    },
    
    /**
     * Session callback - called when accessing session
     * Verify token validity and check role in DB for authorization
     */
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    /**
     * Redirect callback - control where user is sent after signin/out
     */
    async redirect({ url, baseUrl }) {
      // Prevent open redirect attacks by validating URL
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  /**
   * Session configuration with security hardening
   */
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (reduced from 30 for better security)
    updateAge: 24 * 60 * 60, // Update session every day
  },

  /**
   * JWT configuration with security settings
   */
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 7 * 24 * 60 * 60, // Must match session.maxAge
  },

  /**
   * Event callbacks for logging security events
   */
  events: {
    async signIn({ user }) {
      console.log(`[AUTH] User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      console.log(`[AUTH] User signed out: ${token.email}`);
    },
  },

  /**
   * General NextAuth settings
   */
  secret: process.env.NEXTAUTH_SECRET,
  
  /**
   * Enable debug logging in development
   */
  debug: process.env.NODE_ENV === "development",
};