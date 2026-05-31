# Deployment (EmotionDetection-FE)

This repo is the **Next.js** UI. The inference API lives in the separate **EmotionDetection-BE** repository.

## 1. Deploy the backend first

See `EmotionDetection-BE` → `DEPLOYMENT.md` (Docker on Render, Hugging Face Spaces, etc.). You need a public **HTTPS** base URL with **no trailing slash**, for example:

`https://your-api.onrender.com`

Confirm in a browser: `https://your-api…/health` should return JSON.

## 2. Deploy the frontend (Vercel)

1. Open [vercel.com](https://vercel.com) and sign in.
2. **Add New** → **Project** → import this GitHub repo (**EmotionDetection-FE** only).
3. **Root Directory**: leave default (repo root). Framework: **Next.js** (auto-detected).
4. **Environment variables** (Production — and Preview if you want previews to hit a real API):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_API_URL` | Same origin as step 1, e.g. `https://your-api.onrender.com` |

   No trailing slash. Redeploy after changing this value.

5. **Deploy**.

`NEXT_PUBLIC_*` is inlined at **build** time. Every API URL change on Vercel needs a new deployment.

## 3. Local production build (optional)

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL in .env.local
npm run build
npm run start
```

## Notes

- **Dev-only rewrites**: `next.config.js` proxies `/api/*` to the backend only when `NODE_ENV === "development"`. Production calls use `NEXT_PUBLIC_API_URL` directly from `lib/api.ts`.
- The backend enables CORS for all origins today, so the browser can call your API host from your Vercel domain without extra API config.
