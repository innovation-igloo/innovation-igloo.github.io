# innovation-igloo.github.io

Static hosting for generic Snowflake field collateral.

Live site: **https://innovation-igloo.github.io/**

## Scope

This repository is **public**. The `innovation-igloo` organization is on GitHub's free
plan, and GitHub Pages cannot serve from a private repository on that plan, so there is
no way to make this site private or access-controlled. Everything committed here is
world-readable and indexable by search engines.

Only generic, shareable material belongs here:

- Reusable product and feature overviews
- Architecture and pattern explainers with no customer context
- Anything you would be comfortable handing to any customer, or posting publicly

Do **not** commit:

- Customer names, logos, account identifiers, or account numbers
- Working session plans, POC notes, or health checks tied to a named customer
- Query results, schema dumps, or metadata from a customer account
- Security findings
- Anything under NDA

Customer-specific collateral stays in the local working directory.

## Hosted pages

| Page | URL | Description |
| --- | --- | --- |
| What's New in AI at Snowflake | [/snowflake-ai/](https://innovation-igloo.github.io/snowflake-ai/) | Snowflake's new and upcoming AI capabilities by functional area, with availability tags. |

## Structure

```
.
├── index.html            landing page, indexes everything below
├── assets/
│   ├── base.css          design tokens, reset, typography, site chrome, status tags
│   ├── doc.css           doc components: tabs, tables, callouts, metric tiles
│   ├── home.css          landing page only
│   └── doc.js            tab and subtab behavior, no per-page config
├── _template/
│   └── index.html        starter for a new doc, copy this
├── snowflake-ai/
│   └── index.html        served at /snowflake-ai/
├── .nojekyll             serve files verbatim, no Jekyll
└── README.md
```

One folder per document, each containing `index.html`. That gives clean extensionless
URLs (`/snowflake-ai/` rather than `/snowflake-ai.html`) and a natural home for any
images or sub-pages a document needs later.

Asset paths are **relative** (`../assets/base.css`), so the site works both when served
from Pages and when you open the files straight off disk in a browser.

## Adding a page

1. Confirm the content clears the scope rules above.
2. `cp -r _template <slug>` and edit `<slug>/index.html`.
3. Add a card in [index.html](index.html) pointing at `<slug>/` and a row in the
   Hosted pages table.
4. Open `<slug>/index.html` in a browser to check it renders.
5. Commit and push to `main`. Pages rebuilds in under a minute.

### Adding a section to a doc

Copy a `<section class="tab-panel">` block and give it a `data-tab` slug plus a
`data-tab-label`:

```html
<section class="tab-panel" data-tab="my-section" data-tab-label="4. My Section">
  ...
</section>
```

`doc.js` builds the tab strip from the panels, so there is no separate tab list to keep
in sync. Panel order is tab order. Exactly one panel should carry `is-active`. The
active tab is written to the URL hash, so `/snowflake-ai/#coco` links straight to a
section.

## Conventions

- **Shared styling.** Pages link `assets/base.css` and, for tabbed docs,
  `assets/doc.css`. Do not paste a private copy of the design system into a page. If a
  component is genuinely reusable, add it to `doc.css`; if it is truly one-off, a small
  inline `<style>` block in that page is fine.
- **No external dependencies.** No CDN scripts or stylesheets, and no web fonts. Pages
  that reach out to third parties break offline and leak referrer data.
- **No build step.** Files are served exactly as committed. `.nojekyll` disables Jekyll
  processing.
- **Navigation home.** Every doc carries an "All pages" link in its header and footer,
  pointing at `../`. Both are in `_template`, so a copied template already has them.
  The header link is hidden when printing.
- **Availability tags.** Label any capability that is not generally available with its
  actual status, using the `.tag-*` classes in `base.css`.
- **Print works.** `doc.css` expands every tab under `@media print`, so printing or
  saving to PDF captures the whole document rather than just the visible tab.

Directories starting with `_` (such as `_template`) are still served by Pages because
`.nojekyll` is present. They are simply not linked from the landing page.
