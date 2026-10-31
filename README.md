# Splitter

A single web page that splits a chunk of text into Bluesky posts and posts them as a thread. It can be
installed as an app, and it signs in with Bluesky's OAuth (or an app password, if you prefer).

- **Smart splitting.** Posts break at sentence boundaries where possible, with lengths kept roughly even. Word breaks are a fallback, used only when sentence breaks would leave a post very short or over the 300-character limit. Paragraph breaks are preferred but not forced.
- **Images.** Add up to 4 images per post, with alt text. Large images are resized to fit Bluesky's 1 MB limit.
- **Links and hashtags.** These are made clickable, and the first link in a post without images gets a preview card.
- **One-click threads.** If posting fails partway, the button resumes from where it stopped instead of starting over.

## Use

There are two ways to open it, and they differ in what sign-in they allow.

### From a local server (OAuth works here)

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/>.

Use `127.0.0.1`, not `localhost`: Bluesky's authorization server rejects `localhost` as a sign-in
address (RFC 8252 asks for a loopback IP). The app notices and links you to the right address.

This is also the address to install from: use the install button in the header, or your browser's
install icon in the address bar. Once installed it opens in its own window and works offline.

### As a file on disk

Open `index.html` directly. Everything except Bluesky sign-in works that way; if you want to post,
use an app password.

## Signing in

**Sign in with Bluesky** uses atproto OAuth. The browser goes to Bluesky, you approve, and you come
back signed in. It asks for one narrow permission — create posts, including uploading images — so it
cannot read your timeline, change your profile, or delete posts.

A few things are worth knowing:

- The consent screen shows `http://localhost?…` rather than a familiar app name. That is the
  loopback client identifier the atproto spec uses for local apps; Bluesky doesn't show metadata for
  clients it hasn't seen before. The long URL is the permission request itself.
- Sessions last about two weeks. When one expires, Splitter asks you to sign in again.
- The session belongs to the address you signed in at. Changing the port means signing in again.
- On an iPhone or iPad, sign in from a Safari tab before adding the app to the home screen. A
  home-screen app has its own storage and cannot finish the redirect.

**App passwords** still work, and are the only option for a file opened straight from disk. Create
one under Settings → Privacy and security → App passwords, and make one just for Splitter so you can
revoke it without touching anything else. Splitter refuses your account password.

## Privacy

Everything runs in your browser. Your text, images and credentials go only to Bluesky. Link previews
are fetched through `cardyb.bsky.app`, the same service Bluesky's own app uses. The handle is
remembered locally. An app password is saved in local storage only if you tick "Remember" — any other
page on the same address can read it, so leave that off on shared machines. OAuth tokens and the
signing key live in IndexedDB, never in local storage.

## How the OAuth bit works

There is no client library; the app speaks the protocol directly.

- The client identifier is the loopback form `http://localhost?redirect_uri=…&scope=…`, which is why
  no hosting is required.
- Login uses pushed authorization requests and PKCE.
- Tokens are bound to a non-extractable ECDSA P-256 key (DPoP) that never leaves the browser.
- The scopes requested are `atproto` plus `include:app.bsky.authCreatePosts` and a blob scope for
  image uploads — no `transition:generic`.

Serving it anywhere other than `127.0.0.1` will need a hosted `client-metadata.json`; the app has the
seam for that but no hosted client yet.

## Layout

| File | Purpose |
| --- | --- |
| `index.html` | the whole app: markup, styles, script |
| `manifest.webmanifest` | name, icons, install behaviour |
| `sw.js` | service worker caching the app shell |
| `icons/` | SVG sources and generated PNGs |

## Development

No build step, no dependencies, no bundler. Edit `index.html` and reload. Two things to remember:

- Icons are generated from the SVGs: `rsvg-convert -w 512 -h 512 icons/icon.svg -o icons/icon-512.png`
  (and likewise for 192; `icon-maskable.svg` is the source for the maskable and Apple touch icons).
- When `index.html` or the icon set changes, bump `VERSION` in `sw.js`, or installed copies will keep
  the old shell until the cache expires.
