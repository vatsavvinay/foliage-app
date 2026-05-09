import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function getOrCreateCart(userId?: string) {
  if (userId) {
    // Authenticated user - find or create cart by userId
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    return cart;
  } else {
    // Guest user - use session-based cart
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("cart_session_id")?.value;

    if (!sessionId) {
      sessionId = uuidv4();
      cookieStore.set("cart_session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    let cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    return cart;
  }
}

export async function addToCart(
  productId: string,
  quantity: number,
  userId?: string
) {
  const cart = await getOrCreateCart(userId);

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    // Update quantity
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: { product: true },
    });
  } else {
    // Create new cart item
    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: { product: true },
    });
  }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number,
  userId?: string
) {
  const cart = await getOrCreateCart(userId);

  // Verify cart item belongs to this cart
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cartId: cart.id,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    return await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: { product: true },
  });
}

export async function removeFromCart(cartItemId: string, userId?: string) {
  const cart = await getOrCreateCart(userId);

  // Verify cart item belongs to this cart
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cartId: cart.id,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
}

export async function clearCart(userId?: string) {
  const cart = await getOrCreateCart(userId);
  
  return await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
}

export async function mergeGuestCartToUser(
  sessionId: string,
  userId: string
) {
  // Find guest cart
  const guestCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) {
    return;
  }

  // Get or create user cart
  let userCart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: { userId },
    });
  }

  // Merge cart items
  for (const item of guestCart.items) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: userCart.id,
          productId: item.productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + item.quantity },
      });
    } else {
      // Create new item in user cart
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }
  }

  // Delete guest cart
  await prisma.cart.delete({
    where: { id: guestCart.id },
  });
}

export async function getCartTotal(userId?: string) {
  const cart = await getOrCreateCart(userId);
  
  const total = cart.items.reduce((sum: number, item: { product: { price: number }; quantity: number }) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  return {
    subtotal: total,
    tax: total * 0.1, // 10% tax - adjust as needed
    shippingCost: total > 50 ? 0 : 10, // Free shipping over $50
    total: total + (total * 0.1) + (total > 50 ? 0 : 10),
    itemCount: cart.items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0),
  };
}