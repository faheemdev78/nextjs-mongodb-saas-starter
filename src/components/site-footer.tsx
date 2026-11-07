import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          {APP_NAME} is a sample SaaS starter. Demo passwords are fixtures, not secrets.
        </p>
        <p>MIT License</p>
      </div>
    </footer>
  );
}
