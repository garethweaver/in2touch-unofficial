/*
 * Service worker: lets the app open and be browsed with no connection.
 *
 * Saved teams and leagues already live in localStorage, so caching the app's
 * pages and static assets is enough to make them browsable offline.
 *
 * - Pages: network first (4s timeout), falling back to the cached copy.
 *   /teams and /leagues are single static pages that read ?id=, so one cached
 *   copy covers every team and league.
 * - /_next/static/*: cache first (file names are content hashed).
 * - Firebase, analytics and other cross-origin requests are left alone.
 *
 * The version comes from the registration URL (/sw.js?v=<build id>), so each
 * deploy installs a fresh worker and cache and the old cache is deleted.
 */
const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE = `app-${VERSION}`;
const PAGES = ["/", "/settings", "/teams", "/leagues", "/add/teams", "/add/leagues"];
const NAV_TIMEOUT_MS = 4000;

// /_next/static assets referenced by a page (including JSON-escaped ones in the
// inline RSC payload) or by another chunk, which lists them as "static/chunks/…"
const ASSET_RE = /(?:\/_next\/)?static\/(?:chunks|css|media)\/[^"'\\\s)]+/g;
const toAssetUrl = (match) => (match.startsWith("/_next/") ? match : `/_next/${match}`);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const found = new Set();
      for (const page of PAGES) {
        const res = await fetch(page, { cache: "reload" });
        if (!res.ok) throw new Error(`Precache failed for ${page}: ${res.status}`);
        const html = await res.clone().text();
        for (const [m] of html.matchAll(ASSET_RE)) found.add(toAssetUrl(m));
        await cache.put(page, res);
      }
      await precacheAssets(cache, found);
      await cache.add("/manifest.webmanifest").catch(() => {});
      await self.skipWaiting();
    })(),
  );
});

// Cache every asset in `urls`, then any chunks those reference (lazy-loaded
// code such as next/dynamic imports isn't listed in the page HTML).
// Best effort: a missing asset shouldn't stop the app working offline.
async function precacheAssets(cache, urls) {
  const seen = new Set();
  let wave = [...urls];
  while (wave.length) {
    wave.forEach((u) => seen.add(u));
    const next = new Set();
    await Promise.all(
      wave.map(async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return;
          await cache.put(url, res.clone());
          if (!/\.(js|css)$/.test(new URL(url, self.location.origin).pathname)) return;
          for (const [m] of (await res.text()).matchAll(ASSET_RE)) {
            const u = toAssetUrl(m);
            if (!seen.has(u)) next.add(u);
          }
        } catch {
          // skip
        }
      }),
    );
    wave = [...next];
  }
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k.startsWith("app-") && k !== CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/_vercel/")) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(req));
  } else if (req.mode === "navigate") {
    event.respondWith(page(req, url));
  } else if (!req.headers.has("RSC")) {
    // icons, manifest etc. When an RSC request fails offline, Next falls back
    // to a full page load, which the navigate branch then serves from cache.
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  try {
    return await fetch(req);
  } catch (e) {
    const hit = await caches.match(req);
    if (hit) return hit;
    throw e;
  }
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

async function page(req, url) {
  const cache = await caches.open(CACHE);
  const key = PAGES.includes(url.pathname) ? url.pathname : null;
  try {
    const res = await Promise.race([fetch(req), timeout(NAV_TIMEOUT_MS)]);
    // keep the cached copy fresh (without the query string: one copy per page)
    if (key && res.ok && !res.redirected) cache.put(key, res.clone());
    return res;
  } catch {
    const hit = key && (await cache.match(key));
    if (hit) return hit;
    return new Response(
      '<!DOCTYPE html><meta name="viewport" content="width=device-width"><body style="background:#000;color:#fff;font-family:sans-serif;padding:40px 20px">' +
        '<p>You\'re offline and this page isn\'t available offline.</p><p><a style="color:#fff" href="/">Go to your teams</a></p>',
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
}
