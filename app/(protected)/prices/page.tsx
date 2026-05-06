import { RemoteMount } from "@/components/remote-mount";
import { getRequiredSession, toAuthSnapshot } from "@/lib/auth/session";
import { remoteUrls } from "@/lib/remote-urls";

export default async function PricesPage() {
  const session = await getRequiredSession();

  return (
    <RemoteMount
      appName="Prices App"
      authSnapshot={toAuthSnapshot(session)}
      remoteUrl={remoteUrls.prices}
      route="/prices"
    />
  );
}