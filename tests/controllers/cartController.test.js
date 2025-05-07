import { describe, test, expect } from 'vitest';

export const addToCart = (itemId, quantity) => {
  if (itemId && quantity > 0) {
    return { success: true, itemId, quantity };
  }
  return { success: false };
};

describe('Cart Controller', () => {
  test('adds item to cart successfully', () => {
    const result = addToCart('123', 2);
    expect(result.success).toBe(true);
    expect(result.quantity).toBe(2);
  });

  test('fails with invalid input', () => {
    const result = addToCart(null, 0);
    expect(result.success).toBe(false);
  });
});
