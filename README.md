# Retirement Calculators (South Africa)

Self-contained retirement calculators for WordPress. They need no plugins, external scripts, fonts or third-party services. Each calculator (HTML, CSS and JavaScript) is in one file:

- [`retirement-annuity-calculator.html`](retirement-annuity-calculator.html): retirement annuity (RA) calculator
- [`two-pot-calculator.html`](two-pot-calculator.html): two-pot retirement system calculator

Both can go on the same page.

## Two-pot calculator

- Splits a fund balance into the savings, vested and retirement components. It estimates the split from a total balance (contributions since 1 September 2024 split 1/3 : 2/3, plus the 10% seed capped at R30 000, less earlier withdrawals), or takes the three balances from the member's statement
- Tax on a savings withdrawal at the member's marginal rate (SARS 2026/27 tables), fund admin fee and cash received, with checks for the R2 000 minimum and the available savings balance
- What the withdrawal does to the retirement pot, once or every year: the projected pot by component with and without the withdrawal, monthly retirement income lost, and what each R1 of cash taken now costs at retirement (all in today's money)
- The two-pot rules (seed, cap, split, minimum withdrawal) and tax tables can be edited in `CONFIG`

## Retirement annuity calculator

- Projected RA value at retirement, in today's money and in future money
- Estimated monthly income in retirement, based on a drawdown rate
- An "Are you on track?" check against an income goal, plus the monthly contribution needed to reach it
- Tax saving this year using the SARS 2026/27 tables, including the 27.5% / R430 000 deduction limit, pension or provident fund contributions that share the limit, and the carry-forward of excess contributions
- How much fees cost you, compared with a higher-fee product
- An interactive growth chart and a year-by-year table

## Add it to WordPress

1. Open the calculator file and copy **everything**.
2. In WordPress, add one of these to your page:
   - Block editor (Gutenberg): a **Custom HTML** block
   - Divi: a **Code** module
   - Elementor: an **HTML** widget
3. Paste the code in, then save or publish.

> Don't paste it into a normal paragraph or text block, or into the Classic editor's Visual tab. WordPress will strip out the script.

## Customise

Edit the `CONFIG` object near the top of each file's `<script>` section:

| Setting | Purpose |
|---|---|
| `theme` | `'light'`, `'dark'` or `'auto'` |
| `accentColor` | Your brand colour, e.g. `'#b0122b'` |
| `taxBrackets`, `rebates`, `deductionPct`, `deductionCap`, `taxYearLabel` | Update after each Budget Speech |
| `strategies` | Expected returns above inflation for each investment strategy |
| `cta` | Optional call-to-action button (lead generation). Set `url` to show it |
| `disclaimer` | Disclaimer text |

Default input values (age, income, fees and so on) are the `value="..."` attributes on the inputs in the HTML.
