import { beforeEach, describe, expect, it } from "vitest";
import { createPasswordSalt, hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password auth helpers", () => {
  beforeEach(() => {
    process.env.AUTH_PASSWORD_SECRET = "test-password-secret";
  });

  it("hashes and verifies passwords with a unique salt", async () => {
    const salt = createPasswordSalt();
    const hash = await hashPassword("admin", salt);

    await expect(verifyPassword("admin", salt, hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", salt, hash)).resolves.toBe(false);
  });
});