# GVPro on Base44

The port of **GVPro** — the app behind app.genvidpro.com — onto Base44, at
https://gvpro.base44.app.

Type the name of a business, tap a trade, and its possible sites are already on the phone in
front of you, with that name on them, while you type. Five niches × twelve styles = sixty
pages, every one of them drawn by the real template engine inside an `iframe srcdoc`, never a
picture of a site. Share what you are looking at as a link; order it with one of the two
buttons under it.

**This repo is a delivery, not a deployment.** Every path here is the path the file has to take
inside the Base44 app. [MANIFEST.md](MANIFEST.md) says which files to write, which scaffold
files to change, what permissions the `Lead` entity needs, and what was deliberately left out
of v1.

`app.genvidpro.com` and `genvidpro.com` stay exactly as they are, on Cloudflare. Nothing here
touches them, and no file from here is meant to go near them.

## What is ported as is

`src/gvpro/tpl-engine.js` is `public/tpl-engine.js` from the live app, byte for byte — the
sixty templates were not rewritten, not reformatted and not "modernised". A six-line header sits
on top of it and an ES export sits under it; everything between is the original. Re-porting
means copying the file again and re-applying that tail.

The same goes for the three generated language packs under `src/gvpro/lang/`, the 70 web fonts
and the 140 photographs: they are the app's own, so the previews look like the previews people
already know.

## Run it

```
npm install
npm run build
npm run preview          # http://127.0.0.1:4173
node tests/check.mjs     # the walk: 1521 px and 375 px, RTL, share link, form
```

The build runs against the stock Base44 scaffold with no extra dependency. Without
`VITE_BASE44_APP_ID` the SDK has no backend, which is fine for the build and for the walk —
`tests/check.mjs` answers every API call locally, so it never writes a Lead anywhere.

The screenshots the walk leaves in `tests/shots/` are meant to be looked at. A green run on its
own proves nothing; it has caught a clipped slogan and an Arabic page full of English that both
passed every assertion that existed at the time.
