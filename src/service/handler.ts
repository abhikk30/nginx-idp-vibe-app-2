// ---------------------------------------------------------------------------
// nginx_idp_vibe_app_2 – domain handler
// Port: 8080
// Behaviour: return "Hello from IDP" together with the current pod name.
//
// The pod name is injected by Kubernetes via the environment variable
// POD_NAME (set through the Downward API in the Helm chart's deployment.yaml).
// ---------------------------------------------------------------------------

/** Shape of the response produced by handleGetGreeting. */
export interface GetGreetingResponse {
  message: string;
  podName: string;
}

/**
 * Pure handler – resolves the greeting and the pod identity.
 *
 * @param podName - The name of the pod, supplied by the caller from
 *                  `process.env.POD_NAME`.  Falls back to "unknown-pod"
 *                  when the environment variable is not set.
 * @returns        A strictly-typed response object.
 */
export function handleGetGreeting(
  podName: string = process.env.POD_NAME ?? "unknown-pod"
): GetGreetingResponse {
  return {
    message: "Hello from IDP",
    podName,
  };
}

/**
 * Renders the greeting as an HTML page suitable for serving via Nginx / Fastify.
 *
 * @param response - The resolved GetGreetingResponse.
 * @returns          An HTML string.
 */
export function renderGreetingHtml(response: GetGreetingResponse): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IDP Vibe App</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #ffffff;
    }

    .card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 1.5rem;
      padding: 3rem 4rem;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .card h1 {
      font-size: 2.8rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      background: linear-gradient(90deg, #00d2ff, #7b2ff7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1.2rem;
    }

    .card .pod-label {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.5);
      margin-bottom: 0.4rem;
    }

    .card .pod-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #00d2ff;
      word-break: break-all;
    }

    footer {
      margin-top: 2rem;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.3);
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>${response.message}</h1>
    <p class="pod-label">Served by pod</p>
    <p class="pod-name">${escapeHtml(response.podName)}</p>
  </div>
  <footer>nginx-idp-vibe-app-2 &bull; port 8080</footer>
</body>
</html>`;
}

/**
 * Minimal HTML-escape helper (no external dependencies).
 */
export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
