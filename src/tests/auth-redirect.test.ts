import { describe, expect, it } from "vitest";
import { sanitizeRedirectPath } from "@/lib/auth/redirect";

describe("sanitizeRedirectPath", () => {
  it("keeps safe internal routes", () => {
    expect(sanitizeRedirectPath("/about?tab=details")).toBe("/about?tab=details");
  });

  it("rejects absolute and malformed redirects", () => {
    expect(sanitizeRedirectPath("https://example.com")).toBe("/");
    expect(sanitizeRedirectPath("//malicious.test")).toBe("/");
    expect(sanitizeRedirectPath(undefined)).toBe("/");
  });
});