import { RemoteMount } from "@/components/remote-mount";
import { remoteUrls } from "@/lib/remote-urls";

export default function ProductsPage() {
  return (
    <RemoteMount
      remoteUrl={remoteUrls.products}
      route="/products"
      appName="Products App"
    />
  );
}
