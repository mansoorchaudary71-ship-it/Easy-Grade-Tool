# Fix: one device keeps showing the old site after a successful deploy

Copy the two files in `src/` over the same paths and commit.

CAUSE
The PWA service worker serves every page from its precached `index.html` and keeps a new version
"waiting" until the person clicks Reload (registerType 'prompt', skipWaiting false). Two things hid that:
1. The update is detected right after page load, often before React has mounted, so the one-shot
   `egt:sw-update` event was fired into nothing and the "Reload" banner never appeared.
2. Nothing re-checked for updates while a tab stayed open.

CHANGES
- src/main.tsx                    waiting update is applied silently right after load (only if the person has not
                                  touched the page, at most once a minute); otherwise parked on window.__egtSwApply;
                                  open tabs re-check every 30 min and when the tab becomes visible.
- src/components/UpdatePrompt.tsx reads window.__egtSwApply on mount, so the banner can no longer be missed.

ONE-TIME CLEANUP ON A DEVICE THAT IS ALREADY STUCK
Chrome/Edge: F12 > Application > Storage > tick "Unregister service workers" + "Cache storage" > "Clear site data", then reload.
