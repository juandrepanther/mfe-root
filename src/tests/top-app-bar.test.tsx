import { render } from "@testing-library/react";
import { createElement } from "react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { TopAppBar } from "@/components/top-app-bar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => createElement("a", { href, ...props }, children),
}));

describe("TopAppBar", () => {
  it("renders the app bar title", () => {
    const { getByText } = render(<TopAppBar />);

    expect(getByText("MFE Dashboard")).toBeVisible();
  });
});
