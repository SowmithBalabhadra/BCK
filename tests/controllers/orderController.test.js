import { describe, test, expect } from 'vitest';

// Pretend export from order controller
export const processOrder = (orderId = null, status = "pending") => {
  return {
    id: orderId || "default123",
    status,
    timestamp: new Date().toISOString(),
    items: Array.isArray(orderId) ? orderId : ["item1", "item2"],
  };
};

describe('orderController', () => {
  test('processOrder returns expected structure', () => {
    const result = processOrder("ORD123", "shipped");
    expect(result.id).toBe("ORD123");
    expect(result.status).toBe("shipped");
    expect(result.items.length).toBeGreaterThan(0);
  });

  test('processOrder returns default values', () => {
    const result = processOrder();
    expect(result.id).toBeDefined();
    expect(result.status).toBe("pending");
    expect(result.timestamp).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});
