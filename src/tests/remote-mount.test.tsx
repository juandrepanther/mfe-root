import { render, waitFor } from "@testing-library/react";
import type { RemoteModule } from "@/lib/remote-runtime";
import { isRemoteModuleCached } from "@/lib/remote-runtime";
import { loadRemoteModule } from "@/lib/remote-runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RemoteMount } from "@/components/remote-mount";

vi.mock("@/lib/remote-runtime", () => ({
  isRemoteModuleCached: vi.fn(() => false),
  loadRemoteModule: vi.fn(),
}));

const isRemoteModuleCachedMock = vi.mocked(isRemoteModuleCached);
const loadRemoteModuleMock = vi.mocked(loadRemoteModule);

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

const createDeferred = <T,>(): Deferred<T> => {
  let resolve: (value: T) => void = () => undefined;

  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
};

const createRemoteModule = (mountedText: string): RemoteModule => ({
  mount: (container) => {
    container.textContent = mountedText;
  },
  unmount: (container) => {
    container.textContent = "";
  },
});

describe("RemoteMount", () => {
  beforeEach(() => {
    isRemoteModuleCachedMock.mockReset();
    isRemoteModuleCachedMock.mockReturnValue(false);
    loadRemoteModuleMock.mockReset();
  });

  it("shows loader when navigating between micro-frontends", async () => {
    const productsDeferred = createDeferred<RemoteModule>();
    const aboutDeferred = createDeferred<RemoteModule>();

    loadRemoteModuleMock
      .mockImplementationOnce(async () => productsDeferred.promise)
      .mockImplementationOnce(async () => aboutDeferred.promise);

    const { getByText, queryByText, rerender } = render(
      <RemoteMount
        remoteUrl="http://localhost:4102/remote-entry.js"
        route="/products"
        appName="Products App"
      />,
    );

    expect(getByText("Loading Products App remote...")).toBeVisible();

    productsDeferred.resolve(createRemoteModule("products mounted"));

    await waitFor(() => {
      expect(queryByText("Loading Products App remote...")).not.toBeInTheDocument();
    });

    expect(getByText("products mounted")).toBeVisible();

    rerender(
      <RemoteMount
        remoteUrl="http://localhost:4101/remote-entry.js"
        route="/about"
        appName="About App"
      />,
    );

    expect(getByText("Loading About App remote...")).toBeVisible();

    aboutDeferred.resolve(createRemoteModule("about mounted"));

    await waitFor(() => {
      expect(queryByText("Loading About App remote...")).not.toBeInTheDocument();
    });

    expect(getByText("about mounted")).toBeVisible();
    expect(loadRemoteModuleMock).toHaveBeenNthCalledWith(
      1,
      "http://localhost:4102/remote-entry.js",
    );
    expect(loadRemoteModuleMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:4101/remote-entry.js",
    );
  });

  it("skips loader when navigating back to a cached remote", async () => {
    isRemoteModuleCachedMock
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    loadRemoteModuleMock.mockImplementation(async (url) => {
      if (url.includes("4102")) {
        return createRemoteModule("products mounted");
      }

      return createRemoteModule("about mounted");
    });

    const { getByText, queryByText, rerender } = render(
      <RemoteMount
        remoteUrl="http://localhost:4102/remote-entry.js"
        route="/products"
        appName="Products App"
      />,
    );

    expect(getByText("Loading Products App remote...")).toBeVisible();

    await waitFor(() => {
      expect(getByText("products mounted")).toBeVisible();
    });

    rerender(
      <RemoteMount
        remoteUrl="http://localhost:4101/remote-entry.js"
        route="/about"
        appName="About App"
      />,
    );

    expect(getByText("Loading About App remote...")).toBeVisible();

    await waitFor(() => {
      expect(getByText("about mounted")).toBeVisible();
    });

    rerender(
      <RemoteMount
        remoteUrl="http://localhost:4102/remote-entry.js"
        route="/products"
        appName="Products App"
      />,
    );

    expect(queryByText("Loading Products App remote...")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(getByText("products mounted")).toBeVisible();
    });
  });
});