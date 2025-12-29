import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(session.user as any).id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const items = body?.items as { id: string; quantity: number }[];

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items to checkout' }, { status: 400 });
  }

  const productIds = items.map((i) => i.id);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds }, published: true },
  });
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let total = 0;
  for (const item of items) {
    const product = productMap.get(item.id);
    if (!product) continue;
    const price = parseFloat(product.price.toString());
    total += price * (item.quantity || 0);
  }

  if (total <= 0) {
    return NextResponse.json({ error: 'Invalid cart' }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      userId: (session.user as any).id,
      status: 'pending',
      totalPrice: new Prisma.Decimal(total.toFixed(2)),
      shippingAddress: 'Not provided',
      items: {
        create: items
          .filter((i) => productMap.has(i.id))
          .map((i) => {
            const product = productMap.get(i.id)!;
            return {
              productId: product.id,
              quantity: i.quantity,
              price: product.price,
            };
          }),
      },
    },
  });

  return NextResponse.json({ orderId: order.id });
}
