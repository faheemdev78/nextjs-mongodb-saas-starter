import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-24"
    >
      <p className="text-primary text-sm font-medium">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground mt-2">
        That route is not part of this starter.
      </p>
      <Link href="/" className="mt-6 text-sm underline-offset-4 hover:underline">
        Back home
      </Link>
    </main>
  );
}
