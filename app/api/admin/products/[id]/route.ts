import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role ?? 'customer';
  if (!session || role !== 'admin') {
    return null;
  }
  return session;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, description, price, image, categoryId, published } = body || {};

  const data: any = {};
  if (name) {
    data.name = name;
    data.slug = slugify(name);
  }
  if (description !== undefined) data.description = description;
  if (price !== undefined) {
    const numericPrice = parseFloat(price);
    if (Number.isNaN(numericPrice)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    data.price = numericPrice;
  }
  if (image !== undefined) data.image = image || null;
  if (categoryId) data.categoryId = categoryId;
  if (published !== undefined) data.published = !!published;

  const product = await prisma.product.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ product });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
