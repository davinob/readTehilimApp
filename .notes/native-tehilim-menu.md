# Native Tehilim commentary menu (Mar 2026)

- **Issue:** Hamburger inside the Tehilim `iframe` had broken touch hit-testing on Android WebView. A follow-up attempt used `ion-menu` in the lazy-loaded route; that often fails to open / register correctly.
- **Fix (current):**
  - Toolbar uses **`ion-button` + `ion-icon` (menu-outline)** → opens **`ion-modal`** with the commentary list (no `ion-menu`).
  - Toggles call **`iframe.contentWindow.hideShow(class, btn)`** via same-origin **`contentDocument.getElementById`** (fallback: `postMessage`).
  - `myScript.js` assigns **`window.hideShow = hideShow`** so the parent can call it reliably.
- **Iframe:** `#buttonNav` and `#mySidenav` hidden in `stylesTorah.css`.
- **Copyright (Zhuiot):** Menu button hidden when `typeOfRead === 'Zhuiot'`.
