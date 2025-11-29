# Obsidian Folded Markdown Renderer

`obsidian-folded-markdown-renderer` makes the content inside native HTML `<details>` blocks look the same way it would in regular Obsidian notes. The plugin collects every child node only once, rebuilds a single Markdown string, and lets Obsidian render the result so that tables, callouts, and lists behave correctly.

## Features
- Render Markdown inside `<details>` without duplicating DOM work.
- Optional `<summary>` rendering so headers or callouts can appear at the top of the toggle.
- Skip processing entirely when the global toggle is disabled, leaving stock Obsidian behavior untouched.

### Why Obsidian does not render Markdown inside `<details>`

Obsidian’s Markdown engine intentionally **does not parse Markdown that appears inside raw HTML blocks**, including `<details>` and `<summary>`.
 This behavior comes from the underlying CommonMark specification and the Markdown-it parser:
 when Markdown is placed inside an HTML block, it is treated as **literal content** and bypasses the normal Markdown rendering pipeline.

As a result:

- tables, lists, callouts, headings, etc. inside `<details>` appear as plain text
- Obsidian will not re-render or post-process the inner content
- the Live Preview editor mirrors this behavior for consistency

This is why nested Markdown inside `<details>` cannot be rendered correctly without a plugin.

`obsidian-folded-markdown-renderer` works around this limitation by extracting the HTML block’s children, rebuilding them into a single Markdown string, and letting Obsidian render it with full fidelity.

## Installation

### Manual install
1. Create `VaultFolder/.obsidian/plugins/obsidian-folded-markdown-renderer` if it does not exist.
2. Copy `manifest.json`, `main.js`, and `styles.css` from a release into that folder.
3. Reload Obsidian and enable **Obsidian Folded Markdown Renderer** under *Community Plugins*.

### Development install
1. Clone this repository into `.obsidian/plugins/obsidian-folded-markdown-renderer` inside a vault.
2. Install dependencies with `npm install`.
3. Run `npm run dev` to watch and rebuild `main.js` from `main.ts`.
4. Reload Obsidian after every change.

## Settings
- **Render Markdown** — master toggle that tells the plugin whether to touch `<details>` blocks.
- **Render `<summary>`** — optionally include `<summary>` content in the Markdown rendering pipeline (disabled by default to keep built-in styling).

## Plugin metadata
- **Plugin name:** Obsidian Folded Markdown Renderer
- **Plugin ID:** `obsidian-folded-markdown-renderer`
- **Minimum Obsidian version:** 0.15.0

Feel free to open issues or pull requests if you notice rendering edge cases inside `<details>` blocks.
