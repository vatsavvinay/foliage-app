import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role ?? 'CUSTOMER';
  if (!session || role !== 'ADMIN') {
    return null;
  }
  return session;
}

// Note: Next.js route context typing can be strict; use `any` here to avoid validator mismatches.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req: Request, context: any) {
  const { params } = context;
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: unknown = await req.json();
  const { name, description, price, image, categoryId, published } = (body as Record<string, unknown>) || {};

  const data: Record<string, unknown> = {};
  if (typeof name === 'string' && name.trim()) {
    data.name = name;
    data.slug = slugify(name);
  }
  if (description !== undefined) data.description = description;
  if (price !== undefined) {
    const numericPrice = parseFloat(String(price));
    if (Number.isNaN(numericPrice)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    data.price = numericPrice;
  }
  if (image !== undefined) data.imageUrl = typeof image === 'string' ? image : null;
  if (categoryId) data.categoryId = categoryId as string;
  if (published !== undefined) data.published = !!published;

  const product = await prisma.product.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ product });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(_req: Request, context: any) {
  const { params } = context;
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
