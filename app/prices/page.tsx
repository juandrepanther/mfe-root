import { RemoteMount } from "@/components/remote-mount";
import { remoteUrls } from "@/lib/remote-urls";

export default function PricesPage() {
  return (
    <RemoteMount remoteUrl={remoteUrls.prices} route="/prices" appName="Prices App" />
  );
}
