import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

/**
 * Get current user from session (client-safe)
 * Does NOT verify role with database
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Require authentication and return current user
 * Redirects to signin if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user;
}

/**
 * Require admin role
 * Checks role in database (more secure than trusting JWT)
 * Redirects to home if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  
  // Always verify role in database, don't trust JWT
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, role: true },
  });
  
  if (dbUser?.role !== "ADMIN") {
    console.warn(`[AUTH] Non-admin user ${user.email} attempted admin access`);
    redirect("/");
  }
  
  return dbUser;
}

/**
 * Check if user is admin (returns boolean)
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role === "ADMIN";
  } catch (error) {
    console.error(`[AUTH] Error checking admin status for user ${userId}:`, error);
    return false;
  }
}

/**
 * Get full user with all fields from database
 * Use sparingly as it fetches more data
 */
export async function getFullUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error(`[AUTH] Error fetching user ${userId}:`, error);
    return null;
  }
}

/**
 * Verify user has specific permission
 * Extensible for fine-grained access control
 */
export async function hasPermission(
  userId: string,
  permission: 'read:products' | 'write:products' | 'manage:users' | 'view:orders' | 'manage:orders'
): Promise<boolean> {
  const user = await getFullUser(userId);
  
  if (!user) {
    return false;
  }

  // Admin has all permissions
  if (user.role === 'ADMIN') {
    return true;
  }

  // Customer permissions
  if (user.role === 'CUSTOMER') {
    switch (permission) {
      case 'read:products':
        return true;
      case 'view:orders':
        return true; // Can view own orders
      case 'write:products':
      case 'manage:users':
      case 'manage:orders':
        return false;
      default:
        return false;
    }
  }

  return false;
}

/**
 * Log authentication event for audit trail
 */
export async function logAuthEvent(
  userId: string,
  eventType: 'signin' | 'signout' | 'register' | 'password_change' | 'permission_change',
  metadata?: Record<string, any>
) {
  try {
    // In production, send to audit log service
    console.log(`[AUTH_EVENT] ${eventType} - User: ${userId}`, metadata);
  } catch (error) {
    console.error(`[AUTH] Error logging auth event:`, error);
  }
}

/**
 * Invalidate user session for security
 * Call when password is changed, account compromised, etc.
 */
export async function invalidateUserSessions(userId: string) {
  try {
    // NextAuth doesn't have built-in session invalidation
    // Implementation depends on session strategy
    // For JWT: sessions are validated until maxAge expires
    // Consider adding session versioning if needed
    console.log(`[AUTH] Session invalidation initiated for user ${userId}`);
  } catch (error) {
    console.error(`[AUTH] Error invalidating sessions:`, error);
  }
}