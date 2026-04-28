import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function DashboardPage() {
  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Dashboard Home
      </Typography>
      <Typography>
        This shell owns routing for <code>/</code>, <code>/about</code>, <code>/products</code>, and <code>/prices</code>. Navigation uses Next.js client transitions so route changes do not trigger a full page reload.
      </Typography>
    </Paper>
  );
}
