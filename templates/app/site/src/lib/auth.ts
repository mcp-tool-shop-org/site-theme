/**
 * Client-side auth stub for static Astro sites.
 * Uses a simple cookie (`mcp_session=1`) to track auth state.
 * Replace with real auth when connecting to a backend.
 */

const SESSION_COOKIE = 'mcp_session';

export function isAuthenticated(): boolean {
  return document.cookie.split('; ').some((c) => c.startsWith(`${SESSION_COOKIE}=1`));
}

export function signIn(): void {
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 7}`;
}

export function signOut(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

/**
 * Auth guard — call from an inline <script> on protected pages.
 * Redirects to sign-in if not authenticated, reveals body if authenticated.
 *
 * Usage in Astro pages:
 *   <body style="opacity:0">
 *     ...
 *     <script>
 *       import { guardPage } from '../lib/auth';
 *       guardPage();
 *     </script>
 *   </body>
 */
export function guardPage(): void {
  if (!isAuthenticated()) {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.replace(`${import.meta.env.BASE_URL}auth/sign-in?next=${next}`);
    return;
  }
  document.body.style.opacity = '1';
}
