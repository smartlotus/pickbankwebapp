# Pickbank iOS PWA

This folder contains a web PWA version of the Android app logic.

## Run locally

```powershell
cd pwa-ios
python -m http.server 8080
```

Open `http://localhost:8080` in Safari.

## Install on iOS

1. Open the URL in Safari.
2. Tap **Share**.
3. Tap **Add to Home Screen**.

## Notes

- Local data is stored in browser storage.
- In production on Cloudflare Pages, AI requests are forwarded through the local Pages Function endpoint at `/api/chat` to avoid browser CORS issues.
- Local static preview without Pages Functions falls back to direct browser requests to the configured provider (`/v1/chat/completions`).
- HTTPS is required for full PWA behavior in production.
