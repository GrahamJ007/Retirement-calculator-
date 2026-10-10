# Retirement Annuity Calculator (South Africa)

A self-contained retirement annuity (RA) calculator for WordPress. It needs no plugins, external scripts, fonts or third-party services. Everything (HTML, CSS and JavaScript) is in one file: [`retirement-annuity-calculator.html`](retirement-annuity-calculator.html).

## What it calculates

- Projected RA value at retirement, in today's money and in future money
- Estimated monthly income in retirement, based on a drawdown rate
- An "Are you on track?" check against an income goal, plus the monthly contribution needed to reach it
- Tax saving this year using the SARS 2026/27 tables, including the 27.5% / R430 000 deduction limit, pension or provident fund contributions that share the limit, and the carry-forward of excess contributions
- How much fees cost you, compared with a higher-fee product
- An interactive growth chart and a year-by-year table

## Add it to WordPress

1. Open `retirement-annuity-calculator.html` and copy **everything**.
2. In WordPress, add one of these to your page:
   - Block editor (Gutenberg): a **Custom HTML** block
   - Divi: a **Code** module
   - Elementor: an **HTML** widget
3. Paste the code in, then save or publish.

> Don't paste it into a normal paragraph or text block, or into the Classic editor's Visual tab. WordPress will strip out the script.

## Customise

Edit the `CONFIG` object near the top of the `<script>` section:

| Setting | Purpose |
|---|---|
| `theme` | `'light'`, `'dark'` or `'auto'` |
| `accentColor` | Your brand colour, e.g. `'#b0122b'` |
| `taxBrackets`, `rebates`, `deductionPct`, `deductionCap`, `taxYearLabel` | Update after each Budget Speech |
| `strategies` | Expected returns above inflation for each investment strategy |
| `cta` | Optional call-to-action button (lead generation). Set `url` to show it |
| `disclaimer` | Disclaimer text |

Default input values (age, income, fees and so on) are the `value="..."` attributes on the inputs in the HTML.
