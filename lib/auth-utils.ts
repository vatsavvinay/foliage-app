import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  
  // Fetch full user with role
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  });
  
  if (dbUser?.role !== "ADMIN") {
    redirect("/");
  }
  
  return user;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });
  
  return user?.role === "ADMIN";
}