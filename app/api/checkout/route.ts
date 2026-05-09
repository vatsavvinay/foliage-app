import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { getOrCreateCart, clearCart, getCartTotal } from "@/lib/cart-service";
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
    
    // Get cart
    const cart = await getOrCreateCart(user?.id);
    
    if (cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate totals
    const totals = await getCartTotal(user?.id);

    // Create or get address
    let address;
    if (user) {
      address = await prisma.address.create({
        data: {
          userId: user.id,
          ...validatedData.shippingAddress,
        },
      });
    } else {
      // For guest checkout, create a temporary address record
      address = await prisma.address.create({
        data: {
          userId: "guest", // You'll need to handle this in your schema
          ...validatedData.shippingAddress,
        },
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user?.id,
        guestEmail: !user ? validatedData.guestEmail : undefined,
        addressId: address.id,
        subtotal: totals.subtotal,
        tax: totals.tax,
        shippingCost: totals.shippingCost,
        total: totals.total,
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
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });

    // Update product stock
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Clear cart
    await clearCart(user?.id);

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