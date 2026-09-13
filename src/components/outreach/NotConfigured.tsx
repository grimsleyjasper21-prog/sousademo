export default function NotConfigured() {
  return (
    <div className="max-w-xl">
      <p className="oe-eyebrow mb-4">Setup required</p>
      <h1 className="text-3xl mb-4">Supabase is not configured</h1>
      <p className="mb-6">
        The Outreach Engine needs a Supabase project to store leads, batches and
        settings. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code>SUPABASE_SERVICE_ROLE_KEY</code> to your environment, run the SQL
        migration in <code>supabase/migrations/0001_init.sql</code>, then restart
        the app.
      </p>
      <p>See the README for the full setup steps.</p>
    </div>
  );
}
