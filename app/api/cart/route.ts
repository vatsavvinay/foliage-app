import { NextRequest, NextResponse } from "next/server";
import { getOrCreateCart, addToCart } from "@/lib/cart-service";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

// GET /api/cart - Get current cart
export async function GET() {
  try {
    const user = await getCurrentUser();
    const cart = await getOrCreateCart(user?.id);

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    
    const validatedData = addToCartSchema.parse(body);
    
    const cuidPattern = /^[cC][^\s-]{8,}$/;
    let productId = validatedData.productId;

    if (!cuidPattern.test(productId)) {
      let product = await prisma.product.findUnique({
        where: { slug: productId },
        select: { id: true },
      });

      if (!product) {
        product = await prisma.product.findFirst({
          where: {
            OR: [
              { slug: { contains: productId, mode: "insensitive" } },
              { name: { contains: productId, mode: "insensitive" } },
            ],
          },
          select: { id: true },
        });
      }

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      productId = product.id;
    }

    const cartItem = await addToCart(
      productId,
      validatedData.quantity,
      user?.id
    );

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
