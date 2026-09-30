# What Cowork writes into the Base44 app

App: **GVPro**, id `6abd1348da0d052aaed22768`, https://gvpro.base44.app — public, no login.

Every path below is the path **inside the Base44 app**, identical to its path in this repo.
Rows are **NEW** (write it) or **CHANGE** (a scaffold file that has to be replaced).

**Every deliverable file is text** — JS, JSX, CSS, JSON, HTML. Nothing binary, nothing to
upload: the whole app goes in through the platform API. Heebo comes from Google Fonts by a
`<link>`, the icons come from `lucide-react` which the scaffold already depends on, and the
demo draws its own furniture in CSS. No image ships with this app at all.

---

## 1. The app's own modules — src/gvpro/

| | path | what it is |
|---|---|---|
| NEW | `src/gvpro/jobs.js` | The five jobs and all the demo data behind them: services and slots, products, a menu in two sections, a catalogue with one thing out of stock, a rota with four people. Every name carries all four languages beside it, because a croissant belongs to the demo and not to the interface. |
| NEW | `src/gvpro/theme.js` | The six accents (blue `#0038B8` first) and the CSS variables they set. `ink` is stored per colour rather than guessed, so text on the accent never quietly loses contrast. |
| NEW | `src/gvpro/ui.js` | Every word of GVPro in he / en / ru / ar. Hebrew is the fallback, not English. |
| NEW | `src/gvpro/share.js` | The share link ⇄ the view: `?n=&job=&c=&lang=&tab=`. |
| NEW | `src/gvpro/studio.js` | Public studio details: the business agent `972539760820`, the three packages, base44.com, phone normalising, the `gvpro_app` tag. No keys, no personal numbers. |
| NEW | `src/gvpro.css` | The whole look: the flag's blue over near-white, one accent as a variable, 16 px corners, soft shadows. No gradients, no glow. Every class is prefixed `gv-`. |

## 2. The React shell

| | path | what it is |
|---|---|---|
| NEW | `src/pages/Home.jsx` | Two screens. One: the business name and the single question with five job chips. Two: the working app in a phone, the colour swatches, the blue button and the gift line. One column on a phone, two on a laptop, **one set of markup** — the layout moves with grid areas, not a second hidden copy of the button. |
| NEW | `src/pages/Admin.jsx` | `/admin` — the Leads table, newest first, colour shown as a dot, status editable. |
| NEW | `src/components/gvpro/PhoneApp.jsx` | The phone: header, three tabs (the business, the job, the owner), and the demo state that ties them together. What the visitor does on the customer tab shows up on the owner tab. |
| NEW | `src/components/gvpro/demo/HomeView.jsx` | The app's own front page: who, open now, hours, where, and the two buttons a customer looks for. |
| NEW | `src/components/gvpro/demo/BookingView.jsx` | Service → week strip → time slot → confirm. A few slots are already taken. |
| NEW | `src/components/gvpro/demo/OrdersView.jsx` | Products, a basket that counts, a total that adds up, pick-up or delivery, checkout. |
| NEW | `src/components/gvpro/demo/MenuView.jsx` | Sections and dishes; tapping one opens the line about it. |
| NEW | `src/components/gvpro/demo/CatalogueView.jsx` | Products with what is out of stock saying so, and "ask about it". |
| NEW | `src/components/gvpro/demo/TeamView.jsx` | The shift board: five days, morning and evening, open shifts that can be taken. |
| NEW | `src/components/gvpro/demo/OwnerView.jsx` | The owner's screen: today's count, the revenue number, the next customer — moving with whatever the visitor just did. |
| NEW | `src/components/gvpro/OrderSheet.jsx` | Packages → form → thank you, with `Lead.create()` between the second and the third. |
| NEW | `src/components/gvpro/LangSwitch.jsx` | The four languages. |
| NEW | `src/components/gvpro/Footer.jsx` | "by GenVidPro" and the **Built on Base44** badge linking to https://base44.com. |

## 3. Scaffold files that change

| | path | the change |
|---|---|---|
| CHANGE | `src/App.jsx` | Inside `<Routes>`: `/` → `Home`, `/admin` → `Admin`, `*` → `PageNotFound`. The scaffold's `Header`/`Footer` imports are dropped; GVPro carries its own footer. `AuthProvider` / `QueryClientProvider` / `Router` / `Toaster` untouched. |
| CHANGE | `index.html` | `lang="he" dir="rtl"`, the Heebo `<link>` (400/600/700/800), title, description, `theme-color #0038B8`, `viewport-fit=cover`. |
| CHANGE | `public/manifest.json` | Name, Hebrew, RTL, the light background and the blue theme colour. |

Everything else in the scaffold stays exactly as Base44 generated it — `src/main.jsx`,
`src/index.css`, `src/api/base44Client.js`, all of `src/lib/`, `src/components/ui/`,
`ScrollToTop.jsx`, `UserNotRegisteredError.jsx`, `ProtectedRoute.jsx`, `AuthLayout.jsx`,
`GoogleIcon.jsx`, `src/hooks/`, the auth pages under `src/pages/`, `base44/config.jsonc`,
`base44/entities/User.jsonc`, `vite.config.js`, `package.json`, `tailwind.config.js`,
`postcss.config.js`, `jsconfig.json`, `components.json`, `eslint.config.js`.
**No dependency was added** — `lucide-react` was already in the scaffold's `package.json`.

## 4. The Lead entity

`base44/entities/Lead.jsonc` — **NEW**. Fields: `name`, `business_name`, `whatsapp`, `note`,
`job` (booking|orders|menu|catalogue|team), `colour` (blue|teal|green|violet|amber|rose),
`package` (start|business|pro), `lang` (he|en|ru|ar), `status` (new|contacted|won|lost,
default `new`), `source` (default `gvpro`).
Required: `name`, `business_name`, `whatsapp`, `job`.
`style` and `want` from v1 are **gone** — there are no styles any more, and there is only one
thing to want.

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

## 5. Dropped from v1, on purpose

The template engine, the sixty templates, the seventy web fonts and the hundred and forty
photographs are **gone from the working tree** — every one of them still sits in this repo's
history, at commit `46ad186` and its parents, so v1 can be read back in full at any time.

GVPro no longer overlaps with the brand builder on genvidpro.com: that one picks a look, this
one hands over a working app.

**Check my site** and **Ask GVPro** stay out, as before. Both are Cloudflare functions that
refuse any origin but their own — checked live on 30.09.2026, `POST genvidpro.com/chat` →
`403 {"error":"forbidden"}` with `access-control-allow-origin: https://genvidpro.com`, and
`app.genvidpro.com/preview` → `403 {"ok":false,"why":"forbidden"}`. Bringing them back means
editing the allowlist on the genvidpro.com side, which this task must not touch.

`genvidpro.com` and `app.genvidpro.com` are untouched. No file here is meant to go near them.

## 6. Rules carried over

- **App only.** No button anywhere says "site". The gift line under the blue button says the
  app also works as a website on a computer, laptop and tablet — which is a gift, not a choice
  the visitor has to make.
- **The share link needs no database**: `?n=&job=&c=&lang=&tab=` is the whole view, the open
  tab included, and the address bar is kept in step, so a reload and a copied link agree.
- **The demo saves nothing.** Slots, baskets, shifts and the owner's numbers live in React
  state and die with the tab. Every screen of it carries the line that says so.
- **Hebrew first, RTL first class.** Hebrew is the default and the fallback. The document turns
  round for Hebrew and Arabic, and the layout is written with logical properties and grid areas,
  so nothing is mirrored by hand and nothing has to be remembered twice.
- **The business agent only**: `wa.me/972539760820`, tagged `gvpro_app`, with the job, the
  colour, the package and the language in the first message.

## 7. Proof

`npm run build` and `npm run lint` are clean against the stock scaffold.

`node tests/check.mjs` walks the built app at **1521×900** and **375×812**, in **Hebrew and in
English**: the five jobs, the direction of the document, the business name on the app, three
tabs, the gift line, **no button offering a site**, nothing sticking out sideways, a swatch
repainting both the page and the demo, a booking that really books and then appears on the
owner's screen, a basket that adds up to the right number, a shift that can be taken, a dish
that opens, the packages before the form, the form refusing what it should, and a WhatsApp
link carrying the tag, the job, the colour and the package. Then a share link restoring name,
job, colour, language **and the open tab**.

All green — and in v1 three defects passed every assertion and were caught by looking at the
screenshots. The screenshots in `tests/shots/` are still the point.
