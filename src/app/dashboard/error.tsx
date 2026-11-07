"use client";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border p-6">
      <h1 className="text-xl font-semibold">The dashboard could not load</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Check that MongoDB is running and <code>MONGODB_URI</code> is set, then try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-primary text-primary-foreground mt-4 rounded-lg px-3 py-2 text-sm"
      >
        Try again
      </button>
    </div>
  );
}
