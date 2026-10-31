# Splitter

Splits pasted text into Bluesky posts and posts them as a thread. See `README.md`.

## Working conventions
- Keep the app one page: `index.html` holds all markup, styles and script, with no build step and no libraries. If one is ever needed, load it from a pinned CDN version. The PWA companion files (`manifest.webmanifest`, `sw.js`, `icons/`) are the only other moving parts.
- The page must keep working when opened from disk as a bare file; anything that needs an origin (sign-in, installation) degrades to the app-password path with an explanation.
- OAuth is implemented directly against the atproto spec in `index.html`; don't add a client library. Keep the `clientIdFor()` seam — a hosted deployment needs its own branch there.
- Never cache cross-origin requests in `sw.js`, and never put tokens in local storage.
- Discuss and get approval before changing direction or architecture; small fixes the user asked for can go straight ahead.
- The repo is public: never put app passwords, tokens or personal content in committed files. Credentials live only in the user's browser.
- After changing the script, at least run a syntax check (`node --check` on the extracted `<script>`), and check the page in a browser at `http://127.0.0.1:8000/` (console errors, service worker, install prompt). Posting and the OAuth consent click can only be tested by the user.
- Bump `VERSION` in `sw.js` whenever the shell changes.

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
