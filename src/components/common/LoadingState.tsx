export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center gap-3 rounded-lg border bg-card p-6" aria-live="polite">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}
