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
| Beyond a Reasonable dbt | [/beyond-a-reasonable-dbt/](https://innovation-igloo.github.io/beyond-a-reasonable-dbt/) | Managing the Cortex Agent lifecycle as code. A chooser fronting two formats: an eleven-slide executive briefing, and a technical deep dive across five tabbed sections. |
| Openflow SQL Server Connector | [/openflow-sql-server/](https://innovation-igloo.github.io/openflow-sql-server/) | Replicating Microsoft SQL Server into Snowflake in near real time. A hub fronting five tabbed sections: evaluation, mode selection, network setup, how the pipeline runs, and a processor reference. |

## Structure

```
.
├── index.html            landing page, indexes everything below
├── assets/
│   ├── base.css          design tokens, reset, typography, site chrome, tags, cards
│   ├── doc.css           doc components: tabs, section bar, tables, callouts, code
│   ├── home.css          landing page only
│   ├── doc.js            tab and subtab behavior, no per-page config
│   ├── deck.css          full-screen slide deck page type
│   ├── deck.js           slide navigation, no per-page config
│   ├── courtroom.css     theme for the Beyond a Reasonable dbt deck only
│   └── openflow.css      theme for the Openflow SQL Server doc only
├── _template/
│   └── index.html        starter for a new doc, copy this
├── snowflake-ai/
│   └── index.html        served at /snowflake-ai/
├── beyond-a-reasonable-dbt/
│   ├── index.html        chooser, served at /beyond-a-reasonable-dbt/
│   ├── the-case/         section page, the opening statement
│   ├── proceedings/      section page, leaves as tabs
│   ├── exhibit-a/        section page, leaves as tabs
│   ├── exhibit-b/        section page, leaves as tabs
│   ├── exhibit-c/        section page, leaves as tabs
│   └── executive/        full-screen slide deck
├── openflow-sql-server/
│   ├── index.html        hub, served at /openflow-sql-server/
│   ├── evaluate/         section page, leaves as tabs
│   ├── choose/           section page, leaves as tabs
│   ├── network/          section page, leaves as tabs
│   ├── pipeline/         section page, leaves as tabs
│   └── reference/        section page, leaves as tabs
├── .nojekyll             serve files verbatim, no Jekyll
└── README.md
```

One folder per document, each containing `index.html`. That gives clean extensionless
URLs (`/snowflake-ai/` rather than `/snowflake-ai.html`) and a natural home for any
images or sub-pages a document needs later.

A multi-part document nests one level further, as `beyond-a-reasonable-dbt/` and
`openflow-sql-server/` do. Its `index.html` holds no content of its own beyond a summary and
sends the reader on: as a **chooser** between formats, or as a **hub** over sections. Each
section below it is its own page whose tabs are its subsections, with a sticky `.section-bar`
of pills directly below the header linking across sections and back up via its `Overview`
entry.

That bar is a sibling of `<header>`, not a child of it. Both it and `.tab-nav` are sticky, so
the tab strip has to clear it: `doc.css` sets `.tab-nav { top: var(--section-bar-h) }`, which
defaults to `0px`, and a page with a bar opts in with `class="has-section-bar"` on `<body>`.
The bar is pinned to a single line at every width so that height cannot drift.

Asset paths are **relative**, so the site works both when served from Pages and when you
open the files straight off disk. Mind the depth: a top-level doc uses
`../assets/base.css`, a nested section page uses `../../assets/base.css`.

### Page types

| Type | Loads | Use for |
| --- | --- | --- |
| Tabbed doc | `base.css`, `doc.css`, `doc.js` | Reference material, most pages. Start from `_template`. |
| Slide deck | `base.css`, `deck.css`, `deck.js` | Full-screen presentations driven by arrow keys. |

`deck.css` intentionally overrides a few `base.css` rules (`body`, `h1`, `h2`, `.lead`)
because a deck owns the viewport rather than scrolling. Those overrides are grouped at
the top of the file.

## Adding a page

1. Confirm the content clears the scope rules above.
2. `cp -r _template <slug>` and edit `<slug>/index.html`.
3. Add a card in [index.html](index.html) pointing at `<slug>/` and a row in the
   Hosted pages table.
4. Open `<slug>/index.html` in a browser to check it renders. For anything with
   directory URLs, serve it instead: `python3 -m http.server 8000` from the repo root,
   because `file://` will not resolve `/<slug>/` to `index.html`.
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

## After you push a CSS or JS change

Pages serves assets with `cache-control: max-age=600`, so a browser that already loaded
a page will keep the old `base.css`, `doc.css`, or `doc.js` for up to ten minutes. The
usual symptom is new styling not appearing at all, for example a styled link rendering
as a plain blue or purple underlined one.

Hard reload to confirm before assuming the change is broken:

- macOS: `Cmd + Shift + R`
- Or fetch the asset directly, which shows what is actually deployed:
  `curl -s https://innovation-igloo.github.io/assets/base.css | grep my-new-class`

Build status for the exact commit you pushed:

```sh
gh api repos/innovation-igloo/innovation-igloo.github.io/pages/builds/latest \
  --jq '.status + " " + .commit[0:7]'
```

