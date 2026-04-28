const mfeBaseDomain = process.env.NEXT_PUBLIC_MFE_BASE_DOMAIN;

const resolveRemoteUrl = (
  explicitUrl: string | undefined,
  subdomain: string,
  localFallbackUrl: string,
): string => {
  if (explicitUrl) {
    return explicitUrl;
  }

  if (mfeBaseDomain) {
    return `https://${subdomain}.${mfeBaseDomain}/remote-entry.js`;
  }

  return localFallbackUrl;
};

export const remoteUrls = {
  about: resolveRemoteUrl(
    process.env.NEXT_PUBLIC_REMOTE_ABOUT_URL,
    "mfe-about",
    "http://localhost:4101/remote-entry.js",
  ),
  products: resolveRemoteUrl(
    process.env.NEXT_PUBLIC_REMOTE_PRODUCTS_URL,
    "mfe-products",
    "http://localhost:4102/remote-entry.js",
  ),
  prices: resolveRemoteUrl(
    process.env.NEXT_PUBLIC_REMOTE_PRICES_URL,
    "mfe-prices",
    "http://localhost:4103/remote-entry.js",
  ),
};
