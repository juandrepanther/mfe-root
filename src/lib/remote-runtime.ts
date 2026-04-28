export type RemoteMountProps = {
  route: "/about" | "/products" | "/prices";
};

export type RemoteModule = {
  mount: (container: Element, props?: RemoteMountProps) => void;
  unmount: (container: Element) => void;
  getVersion?: () => string;
};

const remoteModuleCache = new Map<string, Promise<RemoteModule>>();

const dynamicImport = new Function(
  "url",
  "return import(url);",
) as (url: string) => Promise<unknown>;

export const isRemoteModuleCached = (url: string): boolean => {
  return remoteModuleCache.has(url);
};

export const clearRemoteModuleCache = (): void => {
  remoteModuleCache.clear();
};

export const loadRemoteModule = async (url: string): Promise<RemoteModule> => {
  const cached = remoteModuleCache.get(url);

  if (cached) {
    return cached;
  }

  const pending = (async () => {
    const loaded = (await dynamicImport(url)) as Partial<RemoteModule>;

    if (typeof loaded.mount !== "function" || typeof loaded.unmount !== "function") {
      throw new Error(`Remote at ${url} does not export mount/unmount functions.`);
    }

    return loaded as RemoteModule;
  })().catch((error: unknown) => {
    remoteModuleCache.delete(url);
    throw error;
  });

  remoteModuleCache.set(url, pending);

  return pending;
};
