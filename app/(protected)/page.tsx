import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { getRequiredSession } from "@/lib/auth/session";

export default async function DashboardPage() {
  const session = await getRequiredSession();

  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Dashboard Home
      </Typography>
      <Typography sx={{ mb: 1.5 }}>
        This shell owns routing for <code>/</code>, <code>/about</code>, <code>/products</code>, and <code>/prices</code>. Navigation uses Next.js client transitions so route changes do not trigger a full page reload.
      </Typography>
      <Typography>
        Signed in as <strong>{session.email}</strong> with role <strong>{session.role}</strong>.
      </Typography>
    </Paper>
  );
}