# Themes

Splitter ships with four themes:

| Theme | Palette |
| --- | --- |
| Atmosphere | light blue, the neutral default |
| Bluesky | Bluesky blue |
| Blacksky | Blacksky black and green |
| Mu.Social | Mu.Social pink |

Built-ins are in `index.html`, so they work from `file://` and apply before the first paint.
Community themes live here.

## Add a theme

1. Create `themes/<slug>/theme.json` (copy `themes/example/theme.json`).
2. Add `"<slug>/theme.json"` to the `themes` array in `themes/index.json`.
3. Reload the app. It appears in the header picker.

The theme is cached by the service worker after the first fetch. `themes/index.json` is
network-first, so adding one does not require editing `index.html` or bumping the cache version.

## Format

```json
{
  "slug": "sunset",
  "name": "Sunset",
  "signIn": "Sunset",
  "description": "Warm orange.",
  "author": "you",
  "homepage": "https://example.com",
  "light": {
    "--bg": "#fff8f2",
    "--panel": "#ffffff",
    "--text": "#2b1a12",
    "--muted": "#7a5c4b",
    "--border": "#f0d8c6",
    "--accent": "#c2410c",
    "--accent-soft": "rgba(194, 65, 12, 0.1)",
    "--on-accent": "#ffffff",
    "--warn": "#b91c1c",
    "--shadow": "0 1px 2px rgba(43, 26, 18, 0.06)"
  },
  "dark": {
    "--bg": "#1a120d",
    "--panel": "#261a13",
    "--text": "#f8ede5",
    "--muted": "#c9a995",
    "--border": "#4a3226",
    "--accent": "#ff8f36",
    "--accent-soft": "rgba(255, 143, 54, 0.16)",
    "--on-accent": "#2a1206",
    "--warn": "#ff8a8a",
    "--shadow": "none"
  }
}
```

- **slug** — unique; lowercase letters, digits and hyphens, up to 40 characters.
- **signIn** — optional service name for the sign-in button (`Sign in with <signIn>`). Defaults to
  Atmosphere; the built-ins use Atmosphere, Bluesky, Blacksky and Mu.
- **light / dark** — token maps. Every token is optional; missing ones fall back to the default
  Atmosphere token. `--on-accent` is the text/icon colour used on top of `--accent`.
- **css** — optional path to an extra stylesheet, resolved relative to `theme.json`. Unlike the
  tokens, this CSS is not sanitized, so review a theme before installing it.
- The schema is in `themes/theme.schema.json`; `themes/example/theme.json` is a complete example
  that is intentionally not listed in `themes/index.json`.

## Limits

- Community themes need the local server (`http://127.0.0.1:8000/` or HTTPS). Browsers cannot
  fetch `theme.json` from `file://`; built-ins still work there.
- The app applies only the tokens above, and only values made of safe CSS characters. Anything
  else is ignored.
- The theme choice is stored in `localStorage` under `splitter-theme`. The last community token
  block is cached under `splitter-theme-css` so it applies before paint on the next visit.
