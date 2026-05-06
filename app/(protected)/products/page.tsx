import { RemoteMount } from "@/components/remote-mount";
import { getRequiredSession, toAuthSnapshot } from "@/lib/auth/session";
import { remoteUrls } from "@/lib/remote-urls";

export default async function ProductsPage() {
  const session = await getRequiredSession();

  return (
    <RemoteMount
      appName="Products App"
      authSnapshot={toAuthSnapshot(session)}
      remoteUrl={remoteUrls.products}
      route="/products"
    />
  );
}