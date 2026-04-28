import { RemoteMount } from "@/components/remote-mount";
import { remoteUrls } from "@/lib/remote-urls";

export default function AboutPage() {
  return (
    <RemoteMount remoteUrl={remoteUrls.about} route="/about" appName="About App" />
  );
}
