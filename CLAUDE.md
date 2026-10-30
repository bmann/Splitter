# Splitter

Splits pasted text into Bluesky posts and posts them as a thread. See `README.md`.

## Working conventions
- Keep the app a single file (`splitter.html`) with no build step and no libraries; if one is ever needed, load it from a pinned CDN version.
- Discuss and get approval before changing direction or architecture; small fixes the user asked for can go straight ahead.
- The repo is public: never put app passwords, tokens or personal content in committed files. Credentials live only in the user's browser.
- After changing the script, at least run a syntax check (`node --check` on the extracted `<script>`). Posting to Bluesky can only be tested by the user.

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
