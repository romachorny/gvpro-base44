# GVPro on Base44

A small Israeli business types its name, says what it needs an app for, and gets one — running,
in its own colour, on the screen in front of it. At https://gvpro.base44.app.

Two screens. The first asks one question: bookings, orders, a menu, a catalogue, or a team on a
rota. The second hands back the app: a phone with a working demo of exactly that job, plus the
owner's own screen — today's count, the revenue, the next customer — because a customer app is
easy to picture and opening your own phone at eight in the morning is not.

Then one blue button: **I want this app**. Under it, the gift — the same app also works as a
website on a computer, laptop and tablet. There is no site to choose and no button that offers
one.

Hebrew is the default and right-to-left is first class. English, Russian and Arabic are there
too. Light, calm, one accent, no gradients: it looks like the apps on base44.com/templates,
not like a studio showreel.

**This repo is a delivery, not a deployment.** Every path here is the path the file has to take
inside the Base44 app. [MANIFEST.md](MANIFEST.md) says which files to write, which scaffold
files to change, what permissions the `Lead` entity needs, and what is deliberately left out.

`app.genvidpro.com` and `genvidpro.com` stay exactly as they are, on Cloudflare. Nothing here
touches them, and no file from here is meant to go near them.

## Every file is text

No fonts, no photographs, no icons on disk — nothing binary to upload. Heebo arrives from
Google Fonts by a `<link>`, the icons come from `lucide-react` which the Base44 scaffold
already depends on, and the demo draws its own furniture in CSS. The whole app can be written
in through the platform API.

## The demo saves nothing

The slots really fill, the basket really adds up, the shift board really hands you a shift —
and all of it lives in React state and dies with the tab. Every screen of the demo says so.

## Run it

```
npm install
npm run build
npm run preview          # http://127.0.0.1:4173
node tests/check.mjs     # the walk: 1521 px and 375 px, in Hebrew and English
```

The build runs against the stock Base44 scaffold with no extra dependency. Without
`VITE_BASE44_APP_ID` the SDK has no backend, which is fine for the build and for the walk —
`tests/check.mjs` answers every API call locally, so it never writes a Lead anywhere.

The screenshots the walk leaves in `tests/shots/` are meant to be looked at. A green run on its
own proves nothing: in v1 it caught a layout that had walked off the right edge while
`scrollWidth` said it was fine, a chip a locator called visible under the iframe covering it,
and a Hebrew app with an English price list that passed the script check aimed at the wrong
element.

## Where v1 went

The template engine, the sixty templates, the seventy fonts and the hundred and forty
photographs are gone from the working tree and still in this repo's history, at commit
`46ad186` and its parents. GVPro used to pick a look; genvidpro.com already does that. This
one hands over a working app.
