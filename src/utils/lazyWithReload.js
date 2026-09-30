import React from 'react';

// After a new deploy, a visitor may still have the OLD page cached. That old page asks
// for old build files (e.g. WhyUs-abc123.js) that no longer exist, so the section never
// loads. When that happens, reload the page once so the browser fetches the new version.
const RELOAD_KEY = 'nextal_chunk_reload_at';

export function reloadOnceForNewVersion() {
  let last = 0;
  try { last = Number(sessionStorage.getItem(RELOAD_KEY) || 0); } catch (e) { /* storage blocked */ }
  // Only reload if we haven't just done so (prevents a reload loop if the file is truly broken)
  if (Date.now() - last > 30000) {
    try { sessionStorage.setItem(RELOAD_KEY, String(Date.now())); } catch (e) { /* ignore */ }
    window.location.reload();
    return true;
  }
  return false;
}

export function lazyWithReload(importer) {
  return React.lazy(() =>
    importer().catch((err) => {
      if (reloadOnceForNewVersion()) {
        return new Promise(() => {}); // keep showing the loading fallback while the page reloads
      }
      throw err;
    })
  );
}
