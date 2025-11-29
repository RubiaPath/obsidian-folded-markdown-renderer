# folded-markdown-renderer

`folded-markdown-renderer` makes the content inside native HTML `<details>` blocks look the same way it would in regular Obsidian notes. The plugin collects every child node only once, rebuilds a single Markdown string, and lets Obsidian render the result so that tables, callouts, and lists behave correctly.

## Features
- Render Markdown inside `<details>` without duplicating DOM work.
- Optional `<summary>` rendering so headers or callouts can appear at the top of the toggle.
- Skip processing entirely when the global toggle is disabled, leaving stock Obsidian behavior untouched.

## Installation

### Manual install
1. Create `VaultFolder/.obsidian/plugins/folded-markdown-renderer` if it does not exist.
2. Copy `manifest.json`, `main.js`, and `styles.css` from a release into that folder.
3. Reload Obsidian and enable **folded-markdown-renderer** under *Community Plugins*.

### Development install
1. Clone this repository into `.obsidian/plugins/folded-markdown-renderer` inside a vault.
2. Install dependencies with `npm install`.
3. Run `npm run dev` to watch and rebuild `main.js` from `main.ts`.
4. Reload Obsidian after every change.

## Settings
- **Render Markdown** — master toggle that tells the plugin whether to touch `<details>` blocks.
- **Render `<summary>`** — optionally include `<summary>` content in the Markdown rendering pipeline (disabled by default to keep built-in styling).

## Plugin metadata
- **Plugin name:** folded-markdown-renderer
- **Plugin ID:** `folded-markdown-renderer`
- **Minimum Obsidian version:** 0.15.0

Feel free to open issues or pull requests if you notice rendering edge cases inside `<details>` blocks.
