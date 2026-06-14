// Pure handler logic for nginx-idp-vibe-app-2 — import-free so it type-checks offline.
export function healthz(): { status: string } {
  return { status: "ok" };
}
export function readyz(): { status: string } {
  return { status: "ready" };
}
export function metrics(): string {
  return "# HELP up 1\n# TYPE up gauge\nup 1\n";
}
