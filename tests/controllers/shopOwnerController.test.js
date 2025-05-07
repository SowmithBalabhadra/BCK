import { describe, test, expect } from 'vitest';

// Mock function simulating a controller method
export const fetchShopDetails = (shopId = "shop123") => {
  return {
    shopId,
    name: "Smart Mart",
    location: "Hyderabad",
    active: true,
    availableArea: 150,
  };
};

describe("shopOwnerController", () => {
  test("fetchShopDetails returns correct structure", () => {
    const result = fetchShopDetails("owner001");
    expect(result.shopId).toBe("owner001");
    expect(result.name).toBeDefined();
    expect(typeof result.availableArea).toBe("number");
    expect(result.active).toBe(true);
  });

  test("fetchShopDetails uses default ID", () => {
    const result = fetchShopDetails();
    expect(result.shopId).toBe("shop123");
    expect(result.name).toContain("Mart");
  });
});
