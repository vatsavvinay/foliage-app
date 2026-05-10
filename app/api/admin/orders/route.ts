import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth, getSecureHeaders } from '@/lib/api-security';

const VALID_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

async function handleGET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where =
      status && VALID_STATUSES.includes(status)
        ? { status: status as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' }
        : {};

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        total: true,
        guestEmail: true,
        createdAt: true,
        user: {
          select: { name: true, email: true },
        },
        address: {
          select: { firstName: true, lastName: true, city: true, state: true },
        },
      },
    });

    return NextResponse.json({ orders }, { headers: getSecureHeaders() });
  } catch (error) {
    console.error('[ADMIN] Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500, headers: getSecureHeaders() }
    );
  }
}

export const GET = withAdminAuth(handleGET);
