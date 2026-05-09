import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { withAdminAuth, getSecureHeaders } from '@/lib/api-security';

/**
 * GET /api/admin/products
 * List all products (admin only)
 */
async function handleGET(_req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        imageUrl: true,
        category: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ products }, { headers: getSecureHeaders() });
  } catch (error) {
    console.error('[ADMIN] Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500, headers: getSecureHeaders() }
    );
  }
}

/**
 * POST /api/admin/products
 * Create new product (admin only)
 */
async function handlePOST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, image, categoryId, published = false } = body || {};

    // Validate required fields
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, categoryId' },
        { status: 400, headers: getSecureHeaders() }
      );
    }

    // Validate name
    if (typeof name !== 'string' || name.length > 255) {
      return NextResponse.json(
        { error: 'Invalid product name' },
        { status: 400, headers: getSecureHeaders() }
      );
    }

    // Validate price
    const numericPrice = parseFloat(String(price));
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400, headers: getSecureHeaders() }
      );
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404, headers: getSecureHeaders() }
      );
    }

    // Check for duplicate slug
    const slug = slugify(name);
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Product with this name already exists' },
        { status: 409, headers: getSecureHeaders() }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() ?? '',
        price: numericPrice,
        imageUrl: image ?? null,
        categoryId,
        published: Boolean(published),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        imageUrl: true,
        category: true,
        published: true,
        createdAt: true,
      },
    });

    console.log(`[ADMIN] Product created: ${product.id}`);

    return NextResponse.json(
      { message: 'Product created successfully', product },
      { status: 201, headers: getSecureHeaders() }
    );
  } catch (error) {
    console.error('[ADMIN] Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500, headers: getSecureHeaders() }
    );
  }
}

export const GET = withAdminAuth(handleGET);
export const POST = withAdminAuth(handlePOST);
