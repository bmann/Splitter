# Splitter

A single web page that splits a chunk of text into Bluesky posts and posts them as a thread.

- **Smart splitting.** Posts break at sentence boundaries where possible, with lengths kept roughly even. Word breaks are a fallback, used only when sentence breaks would leave a post very short or over the 300-character limit. Paragraph breaks are preferred but not forced.
- **Images.** Add up to 4 images per post, with alt text. Large images are resized to fit Bluesky's 1 MB limit.
- **Links and hashtags.** These are made clickable, and the first link in a post without images gets a preview card.
- **One-click threads.** If posting fails partway, the button resumes from where it stopped instead of starting over.

## Use

Open `splitter.html` in a desktop browser (tested in Chrome). There's no build step and no server needed, though serving it (e.g. `python3 -m http.server`) works too.

To post, you need a Bluesky **app password**. Create one under Settings → Privacy and security → App passwords. The page refuses to post with your account password.

## Privacy

Everything runs in your browser. Your text, images and app password go only to Bluesky. Link previews are fetched through `cardyb.bsky.app`, the same service Bluesky's own app uses. The page remembers your handle. It saves the password in the browser's local storage only if you tick "Remember password". Leave that off on shared machines, or when running the page as a local file, since other local pages can read that storage.
