import { RemoteMount } from "@/components/remote-mount";
import { getRequiredSession, toAuthSnapshot } from "@/lib/auth/session";
import { remoteUrls } from "@/lib/remote-urls";

export default async function AboutPage() {
  const session = await getRequiredSession();

  return (
    <RemoteMount
      appName="About App"
      authSnapshot={toAuthSnapshot(session)}
      remoteUrl={remoteUrls.about}
      route="/about"
    />
  );
}