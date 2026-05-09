import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { getOrCreateCart, clearCart } from "@/lib/cart-service";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { z } from "zod";

const checkoutSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().default("USA"),
    phone: z.string().optional(),
  }),
  guestEmail: z.string().email().optional(),
  paymentMethod: z.string().default("credit_card"),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const validatedData = checkoutSchema.parse(body);

    const cart = await getOrCreateCart(user?.id);

    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate stock for every item before touching the DB
    const stockErrors: string[] = [];
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        stockErrors.push(
          `"${item.product.name}" only has ${item.product.stock} in stock (you requested ${item.quantity})`
        );
      }
    }
    if (stockErrors.length > 0) {
      return NextResponse.json(
        { error: "Some items are out of stock", details: stockErrors },
        { status: 409 }
      );
    }

    // Calculate totals server-side using live DB prices
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const tax = subtotal * TAX_RATE;
    const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + tax + shippingCost;

    // Create address + order + decrement stock atomically
    const order = await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          userId: user?.id ?? null,
          ...validatedData.shippingAddress,
        },
      });

      const createdOrder = await tx.order.create({
        data: {
          userId: user?.id,
          guestEmail: !user ? validatedData.guestEmail : undefined,
          addressId: address.id,
          subtotal,
          tax,
          shippingCost,
          total,
          paymentMethod: validatedData.paymentMethod,
          status: "PENDING",
          paymentStatus: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: { include: { product: true } },
          address: true,
        },
      });

      // Decrement stock for each product inside the same transaction
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    // Clear cart outside the transaction (non-critical if it fails)
    await clearCart(user?.id).catch(() => {});

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
