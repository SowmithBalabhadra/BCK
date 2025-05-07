import { describe, test, expect } from 'vitest';

// Simulated controller function
export const login = (username, password) => {
  if (username && password) {
    return { success: true, token: "dummy-token" };
  }
  return { success: false };
};

describe('Auth Controller', () => {
  test('should return success when credentials are passed', () => {
    const response = login('admin', 'password123');
    expect(response.success).toBe(true);
    expect(response).toHaveProperty('token');
  });

  test('should fail without credentials', () => {
    const response = login();
    expect(response.success).toBe(false);
  });
});
