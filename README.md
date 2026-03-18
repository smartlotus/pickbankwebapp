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
- AI requests are sent directly from browser to the configured provider (`/v1/chat/completions`).
- HTTPS is required for full PWA behavior in production.
