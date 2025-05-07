import { describe, test, expect } from 'vitest';

// Simulated mock controller logic
export const getBookingsForShop = (shopId = "demoShop") => {
  return [
    {
      bookingId: "bk101",
      shopId,
      status: "confirmed",
      area: 80,
      brand: "D-Mart",
    },
    {
      bookingId: "bk102",
      shopId,
      status: "pending",
      area: 60,
      brand: "Reliance Mart",
    }
  ];
};

describe("shoptakerController", () => {
  test("getBookingsForShop returns array of bookings", () => {
    const bookings = getBookingsForShop("shop456");
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings[0].shopId).toBe("shop456");
    expect(bookings.length).toBeGreaterThan(0);
  });

  test("getBookingsForShop defaults correctly", () => {
    const bookings = getBookingsForShop();
    expect(bookings[0].shopId).toBe("demoShop");
    expect(bookings[1].brand).toMatch(/mart/i);
  });
});
