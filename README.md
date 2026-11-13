# DevToolbox

**JSON, Base64, URL encoding and hashing — computed on your device.**

**[Live: https://quantumcoder-14.github.io/devtoolbox/](https://quantumcoder-14.github.io/devtoolbox/)** — nothing to install.

One self-contained `index.html`. No build step, no framework, no dependencies to install.

| Tab | What it does |
| --- | --- |
| **JSON** | Format with 2/4/1-space or tab indent, minify, validate with the error position, and see key count plus nesting depth |
| **Base64** | Encode and decode UTF-8 text, including emoji and Devanagari — not just ASCII |
| **URL** | Encode everything, encode a URI (keeps `/?&=`), or decode, with `+` treated as space |
| **Hash** | SHA-256, SHA-1 and SHA-512 via the browser's own WebCrypto |

## Why it is local

You paste config files and API responses into tools like this. Those are the documents you
should least want on someone else's server. Every operation here is JavaScript in the page:
there is no endpoint to send anything to, and the hash tab uses `crypto.subtle`, which is the
browser's own implementation rather than a bundled library.

The only network request is Google Fonts. Delete the three `<link>` tags in `<head>` and it
becomes fully offline; the fonts fall back to your system's.

## Details worth knowing

- **JSON validation reports where it broke** — line and column, not just "invalid".
- **Base64 handles real text.** The naive `btoa(text)` breaks on anything above U+00FF; this
  encodes UTF-8 bytes first, so `नमस्ते` survives a round trip.
- **Decode refuses obvious non-Base64** instead of silently producing garbage.
- **The hash tab needs `https://` or `localhost`** — WebCrypto is unavailable on `file://`
  in some browsers, and the page says so rather than failing quietly.

## Run it

Open `index.html`, or host it anywhere static. To publish on GitHub Pages: **Settings →
Pages → Deploy from a branch → `main` → `/ (root)`**.

## Licence

MIT with Commons Clause. Copyright (c) 2026 Siddhant Neekhra. See [LICENSE.md](LICENSE.md).
