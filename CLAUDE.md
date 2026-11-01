# Atmosphere Splitter

Splits pasted text into a thread and posts it to Bluesky. See `README.md`.

## Working conventions
- Keep the app one page: `index.html` holds all markup, styles and script, with no build step and no libraries. If one is ever needed, load it from a pinned CDN version. The PWA companion files (`manifest.webmanifest`, `sw.js`, `icons/`) and community `themes/` are the only other moving parts.
- The page must keep working when opened from disk as a bare file; anything that needs an origin (sign-in, installation, community themes) degrades to the app-password/built-in path with an explanation.
- OAuth is implemented directly against the atproto spec in `index.html`; don't add a client library. `clientIdFor()` uses the loopback client on `127.0.0.1` and `<origin>/client-metadata.json` on HTTPS. The GitHub Pages deployment ships that document on `gh-pages`; any other host needs its own.
- The GitHub Pages site is served from `gh-pages` (static files + `client-metadata.json` + `.nojekyll`). Copy app changes from `main` to that branch when deploying; the metadata document is host-specific.
- Never cache cross-origin requests in `sw.js`, and never put tokens in local storage.
- Mentions resolve to DIDs before `createRecord`; a failed lookup must always fall back to plain text. Typeahead queries are debounced and cached, and the service is a third party (`typeahead.waow.tech`), so keep the `X-Client` header set.
- Link cards are fetched once while typing and reused at post time — never fetch `cardyb` again inside `postThread()`. A failed card fetch must never block splitting or posting, and the thumbnail slot must say why it is empty.
- A `bsky.app/profile/…/post/…` URL is a quote, not an external card: resolve it to `{ uri, cid }` through `public.api.bsky.app` (`getPosts`) and post `app.bsky.embed.record`. Cache by URL and reuse the resolved CID at post time; quoting is still an `app.bsky.feed.post` create, so `app.bsky.authCreatePosts` already covers it.
- Pinned previews live in `pins[i]` by post slot, like `media[i]`, and the preview shows which slot holds one. `embedFor(text, i, auth)` uses the URL in the text first, then the pin; images still win. Clear pins in `resetComposer`, and keep an Unpin path for a pinned preview whose fetch failed.
- A continuation keeps `root` (the original first ref) and `parent` (the last published ref) on the thread; `refs[0]` is only the root of a first segment. A failed segment must keep its continuation state so Resume replies from the same parent.
- Inline tags are out-of-band: `record.tags` (max 8 per post, 64 graphemes each), never appended to `text` or facets. `currentPosts`/`finalPosts` stay body-only; `tagSets()` and `threadSignature()` include tags for keys and the 8-tag guard. Tag pills live under the white post card; per-post additions/removals are indexed like media/pins and clear on New/Continue. Body hashtags stay facets and are not duplicated in `tags`.
- Themes are token blocks: built-ins in `index.html` (so `file://` works and the first paint is correct), community themes in `themes/<slug>/theme.json` listed by `themes/index.json`. The picker persists `splitter-theme`; a tiny head script applies it before paint and caches community token CSS under `splitter-theme-css`. Keep `themes/index.json` and theme files network-first in `sw.js`, and do not require an `index.html` edit to add a community theme.
- Discuss and get approval before changing direction or architecture; small fixes the user asked for can go straight ahead.
- The repo is public: never put app passwords, tokens or personal content in committed files. Credentials live only in the user's browser.
- After changing the script, at least run a syntax check (`node --check` on the extracted `<script>`), and check the page in a browser at `http://127.0.0.1:8000/` (console errors, service worker, install prompt). Posting and the OAuth consent click can only be tested by the user.
- Bump `VERSION` in `sw.js` whenever the shell, a built-in palette, or the theme loader changes.

## How to report back

I skim your replies. Write for someone who wants to act, not to be taught.

- Lead with the outcome in one or two sentences: what changed, and whether it works.
- Then only what needs my attention: decisions I should make, risks, things you
  couldn't verify, anything surprising or different from what I asked.
- Don't narrate your steps, restate my request, or explain code I can read in the diff.
- Don't list every file touched unless I ask.
- Default to under ~150 words. Go longer only when the content earns it:
  a real trade-off, a bug with a non-obvious cause, or a design choice I need to weigh in on.
- If there's more worth knowing, end with one line offering it ("Want the details on X?")
  instead of including it.
