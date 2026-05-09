import { NextRequest, NextResponse } from "next/server";
import { updateCartItemQuantity, removeFromCart } from "@/lib/cart-service";
import { getCurrentUser } from "@/lib/auth-utils";
import { z } from "zod";

const quantitySchema = z.object({
  quantity: z.number().int(),
});

// PATCH /api/cart/:itemId - Update cart item quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { quantity } = quantitySchema.parse(body);

    const updated = await updateCartItemQuantity(
      params.itemId,
      quantity,
      user?.id
    );

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Cart item not found") {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    console.error("Update cart item error:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/:itemId - Remove cart item
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await getCurrentUser();
    await removeFromCart(params.itemId, user?.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Cart item not found") {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    console.error("Remove cart item error:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
