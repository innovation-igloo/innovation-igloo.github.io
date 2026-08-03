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

| Page | Description |
| --- | --- |
| [snowflake-ai.html](https://innovation-igloo.github.io/snowflake-ai.html) | What's New in AI at Snowflake. Feature breakdown by functional area with availability tags. |

## Adding a page

1. Confirm the content clears the scope rules above.
2. Copy the `.html` file to the repository root.
3. Add a card for it in [index.html](index.html) and a row in the table above.
4. Commit and push to `main`. Pages rebuilds automatically, usually within a minute or two.

## Conventions

- **Self-contained HTML.** Inline the CSS and use inline SVG for graphics. No CDN
  scripts or stylesheets. Pages that depend on external libraries break when opened
  from the local filesystem and leak referrer data to third parties when opened from
  the web.
- **No build step.** Files are served exactly as committed. `.nojekyll` disables Jekyll
  processing.
- **Availability tags.** Label any feature that is not generally available with its
  actual status.
