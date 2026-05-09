import { NextResponse } from "next/server";
import { clearCart } from "@/lib/cart-service";
import { getCurrentUser } from "@/lib/auth-utils";

// DELETE /api/cart/clear - Clear all items from the current cart
export async function DELETE() {
  try {
    const user = await getCurrentUser();
    await clearCart(user?.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
