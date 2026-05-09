import { NextRequest, NextResponse } from "next/server";
import { getOrCreateCart, addToCart, mergeGuestCartToUser } from "@/lib/cart-service";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { z } from "zod";

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

// GET /api/cart - Get current cart (merges guest cart on first authenticated fetch)
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (user?.id) {
      // Merge any existing guest cart into the user's cart on sign-in
      const cookieStore = await cookies();
      const guestSessionId = cookieStore.get("cart_session_id")?.value;
      if (guestSessionId) {
        await mergeGuestCartToUser(guestSessionId, user.id);
        cookieStore.delete("cart_session_id");
      }
    }

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

    // Verify the product exists and is published before adding
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      select: { id: true, published: true },
    });

    if (!product || !product.published) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const cartItem = await addToCart(validatedData.productId, validatedData.quantity, user?.id);
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
