# What Cowork writes into the Base44 app

App: **GVPro**, id `6abd1348da0d052aaed22768`, https://gvpro.base44.app — public, no login.

Every path below is the path **inside the Base44 app**, identical to its path in this repo.
Three kinds of rows: **NEW** (write it), **CHANGE** (a scaffold file that has to be replaced),
**UNCHANGED** (scaffold, listed only so it is clear it must stay).

---

## 1. The engine — src/gvpro/

| | path | what it is |
|---|---|---|
| NEW | `src/gvpro/tpl-engine.js` | The whole template engine from app.genvidpro.com (`public/tpl-engine.js`, commit `ce4005e`, 29.09.2026), byte for byte. Five niches × twelve styles = sixty pages. **Nothing inside it was rewritten**; a six-line header went on top and two lines went under it (`export const GVP = window.GVP`). Verified with `cmp` against the original. |
| NEW | `src/gvpro/config.js` | Sets `window.GVP_PHOTOBASE`, `window.GVP_FONTBASE`, `window.GVP_LANG` **before** the engine is evaluated. `engine.js` imports it first, and ES modules evaluate in import order — that ordering is the only reason this file exists. Do not merge it into `engine.js`. |
| NEW | `src/gvpro/engine.js` | The one door between React and the engine. The rail order of the twelve, the four languages, the RTL rule, the per-language pack loader, `renderPage()`. Nothing else in the app touches `window.GVP`. |
| NEW | `src/gvpro/lang/he.js` | Hebrew pack, copied from `public/lang/he.js` (generated — never hand-edit). |
| NEW | `src/gvpro/lang/ru.js` | Russian pack, same. |
| NEW | `src/gvpro/lang/ar.js` | Arabic pack, same. |
| NEW | `src/gvpro/ui.js` | Every word of the shell in en / he / ru / ar, the app demo and the app screen included. |
| NEW | `src/gvpro/share.js` | The share link ⇄ the view on screen, `mode=site\|app` among them. |
| NEW | `src/gvpro/studio.js` | Public studio details: the business agent `972539760820`, the three packages, genvidpro.com/apps, base44.com, the `@GenVidPro` watermark constant, phone normalising. No keys, no personal numbers. |
| NEW | `src/gvpro/useLangPack.js` | Re-renders whatever reads the engine's own copy once the language pack lands. Without it a Hebrew app showed an English price list for ever — see §7. |
| NEW | `src/gvpro.css` | The GVPro shell, ported from `public/index.html`: the neon head, the trade chips, the rail, the sheets. Every class is prefixed `gv-`. |

## 2. The React shell

| | path | what it is |
|---|---|---|
| NEW | `src/pages/Home.jsx` | The one screen: name field with live preview, trade chips, the **Site / App toggle**, the rail of twelve, language switch, share, the two doors, footer. |
| NEW | `src/pages/Admin.jsx` | `/admin` — the Leads table, newest first, status editable. |
| NEW | `src/components/gvpro/PreviewFrame.jsx` | One preview: the engine's page inside an `iframe srcdoc`, scaled to the card. |
| NEW | `src/components/gvpro/StyleRail.jsx` | The swipe rail. In site mode four pages of one wide card and two tall ones; in app mode twelve pages of one phone each, with only the phone on screen and its two neighbours alive. |
| NEW | `src/components/gvpro/AppPhone.jsx` | The app demo: the chosen template inside a phone with the app layer over it — bottom tab bar (Home, Book or Order by trade, Bookings/Orders, Contact), a booking or order sheet that really works on fake slots and a fake basket, the install chip. Pure frontend; it says on every screen that nothing is really booked. |
| NEW | `src/components/gvpro/AppPitch.jsx` | The screen between "I want an app" and the form: what the app does for this trade, the three packages with one line each, and who owns the account. |
| NEW | `src/components/gvpro/Viewer.jsx` | The style at full size with the two doors under it. |
| NEW | `src/components/gvpro/OrderSheet.jsx` | Three steps behind both doors: the pitch (app only), the short form, the thank-you screen with the WhatsApp button. `Lead.create()` sits between the second and the third. |
| NEW | `src/components/gvpro/LangSwitch.jsx` | The four languages. |
| NEW | `src/components/gvpro/Footer.jsx` | GenVidPro, `@GenVidPro`, and the visible **Built on Base44** badge linking to https://base44.com. |
| NEW | `src/components/gvpro/Slogan.jsx` | "your idea, your app", shrunk until it fits beside the neon letters. |
| NEW | `src/components/gvpro/Icons.jsx` | The five drawn trade signs and the small round-button icons, copied from the old app. |

## 3. Scaffold files that change

| | path | the change |
|---|---|---|
| CHANGE | `src/App.jsx` | Inside `<Routes>`: `/` → `Home`, `/admin` → `Admin`, `*` → `PageNotFound`. The scaffold's `Header` and `Footer` imports are dropped — GVPro carries its own footer on every page. `AuthProvider` / `QueryClientProvider` / `Router` / `Toaster` are untouched. |
| CHANGE | `index.html` | Title `GVPro — your idea, your app`, `viewport-fit=cover`, `theme-color #07060A`, a description. |
| NEW | `public/manifest.json` | The app's own manifest; `index.html` already asks for `/manifest.json`. |

Everything else in the scaffold stays exactly as Base44 generated it — `src/main.jsx`,
`src/index.css`, `src/api/base44Client.js`, all of `src/lib/`, `src/components/ui/`,
`src/components/ScrollToTop.jsx`, `UserNotRegisteredError.jsx`, `ProtectedRoute.jsx`,
`AuthLayout.jsx`, `GoogleIcon.jsx`, `src/hooks/`, the auth pages under `src/pages/`,
`base44/config.jsonc`, `base44/entities/User.jsonc`, `vite.config.js`, `package.json`,
`tailwind.config.js`, `postcss.config.js`, `jsconfig.json`, `components.json`,
`eslint.config.js`. **No dependency was added** — `package.json` is the scaffold's own.

## 4. Static assets (binary)

| | path | count / size |
|---|---|---|
| NEW | `public/fonts/*.woff2` | 70 files, 1.3 MB. The engine writes `@font-face` at `/fonts/…`; without these the sixty pages fall back to system faces and stop being 1:1. |
| NEW | `public/media/photo/**` | 140 files, 9.6 MB. The app's own photo bank. The engine's default points at genvidpro.com, and that copy is **incomplete** — `barber/room.jpg` is 404 there — which is why the old app ships its own and why this port does too. |

If writing 210 binaries through the API is painful, the fonts are the ones that cannot be
skipped; the photos could be pointed back at `https://genvidpro.com/media/photo/` by editing
one line in `src/gvpro/config.js`, at the price of broken photographs in some niches.

## 5. The Lead entity

`base44/entities/Lead.jsonc` — **NEW**. Fields: `name`, `business_name`, `whatsapp`, `note`,
`niche` (barber|clinic|bakery|yoga|garage), `style` (the twelve ids), `lang` (en|he|ru|ar),
`want` (site|app), `package` (""|start|business|pro — set only when `want=app`),
`status` (new|contacted|won|lost, default `new`), `source` (default `gvpro`).
Required: `name`, `business_name`, `whatsapp`, `want`.

**Permissions Cowork has to apply in the app settings — the schema file cannot carry them:**

| action | who |
|---|---|
| **create** | **anyone, signed in or not** (the app is public and the form is the whole point) |
| **read** | **admin only** |
| **update** | **admin only** |
| **delete** | **admin only** |

An anonymous visitor must not be able to read back what they just wrote, list anything, or
touch another record. That rule is the real lock on `/admin`; the role check in `Admin.jsx`
only keeps the page from flashing a table it cannot fill.

`base44/entities/User.jsonc` already carries `role: admin | user` — Roma's own account needs
`role = admin`.

## 6. Left out of v1, on purpose

**Check my site** and **Ask GVPro** are not in this port.

Both are Cloudflare functions that refuse any origin but their own, checked against the live
endpoints on 30.09.2026:

- `POST https://genvidpro.com/chat` → `403 {"error":"forbidden"}`, and the only
  `access-control-allow-origin` it will hand out is `https://genvidpro.com`.
- `GET https://app.genvidpro.com/preview?u=…` → `403 {"ok":false,"why":"forbidden"}`; its
  allowlist is app.genvidpro.com and \*.gvpro.pages.dev.

So a browser on `gvpro.base44.app` cannot call either one, and the brief says to leave them out
rather than work around it. **No API key of any kind is in this repo**, and the way to bring
these two back is to add `https://gvpro.base44.app` to the allowlist on the genvidpro.com side
— a change to a repo this task must not touch, so it is Roma's call, not ours.

## 7. Rules carried over

- **The app is the product, not the second button.** Under every preview the red full-width
  button is "I want an app", translated in all four languages; "I want this site" is the white
  one under it. The app door never asks for a phone number before it has said what the app does
  and what the three packages cost.
- **The share link needs no database**: `?n=&niche=&tpl=&lang=&mode=` is the whole view,
  `mode` among it, so a friend opens the same side of the toggle. The address bar is kept in
  step with the screen, so a reload and a copied URL agree. A link with no `mode` opens the app.
- **The demo books nothing.** Slots, baskets and "my bookings" live in React state and die with
  the tab. Every screen of it carries the line that says so.
- **Truly RTL**: `dir=rtl` on the document, inside every frame, and across the app layer, for
  Hebrew and Arabic. The old app's bug was not the direction — it was that a frame could paint
  before the language pack arrived, so the engine kept `dir=rtl` and filled it with English
  sentences. No frame paints until `ensureLang()` resolves, and anything in React that reads
  the engine's own copy subscribes through `useLangPack` — the demo's price list, the Book/Order
  tab and the style's name all got caught in exactly that trap during this build, each of them
  English inside an otherwise perfect Hebrew screen.
- **Watermark**: `@GenVidPro` on any poster image the app ever renders. v1 renders no poster,
  so the handle sits in the footer and the constant lives in `src/gvpro/studio.js`, where the
  first poster will have to find it.
- **The business agent only**: `wa.me/972539760820`, with tag `gvpro_site` or `gvpro_app` and
  the niche, style and language in the first message. No personal number anywhere.

## 8. Proof

`npm run build` passes against this scaffold (vite 8, 1812 modules, the three language packs
split into their own chunks). `npm run lint` is clean.

`node tests/check.mjs` walks the built app at **1521×900** and **375×812**: the app is what you
land on, the red button is the app one, twelve phones to swipe, four tabs, the install chip
really on top, a demo booking that lands in "my bookings", a bakery that counts a basket instead
of slots, the site side still whole, the app screen before the form, three packages, the Base44
ownership line, the form's validation, the WhatsApp tag and package behind each door, `dir=rtl`
with real Hebrew and Arabic in the frames *and* in the price list, and a share link restoring
name, trade, style, language and mode.

All green — and three of the defects above were found by **looking at the screenshots**, not by
a failing assertion: a layout that walked off the right edge while `scrollWidth` said it was
fine, an install chip a locator called visible under the iframe covering it, and a Hebrew app
with an English price list that passed a script check aimed at the wrong element. Each of those
now has a test that would catch it; the screenshots in `tests/shots/` are still the point.
