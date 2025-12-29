import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role ?? 'customer';
  if (!session || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role ?? 'customer';
  if (!session || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, price, image, categoryId, published = false } = body || {};

  if (!name || !price || !categoryId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const slug = slugify(name);
  const numericPrice = parseFloat(price);
  if (Number.isNaN(numericPrice)) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description ?? '',
      price: numericPrice,
      image: image ?? null,
      categoryId,
      published: !!published,
    },
  });

  return NextResponse.json({ product });
}
