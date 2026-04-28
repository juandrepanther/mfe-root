export const remoteUrls = {
  about:
    process.env.NEXT_PUBLIC_REMOTE_ABOUT_URL ??
    "http://localhost:4101/remote-entry.js",
  products:
    process.env.NEXT_PUBLIC_REMOTE_PRODUCTS_URL ??
    "http://localhost:4102/remote-entry.js",
  prices:
    process.env.NEXT_PUBLIC_REMOTE_PRICES_URL ??
    "http://localhost:4103/remote-entry.js",
};
