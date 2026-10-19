# Retirement Calculators (South Africa)

Self-contained retirement calculators for WordPress. They need no plugins, external scripts, fonts or third-party services. Each calculator (HTML, CSS and JavaScript) is in one file:

- [`retirement-annuity-calculator.html`](retirement-annuity-calculator.html): retirement annuity (RA) calculator
- [`two-pot-calculator.html`](two-pot-calculator.html): two-pot retirement system calculator

Both can go on the same page.

## Two-pot withdrawal calculator

Built to the pensionfund.co.za build spec (page `/two-pot-withdrawal-calculator/`).

- **Tax and net payout:** tax on a savings withdrawal using the SARS directive method, `tax(income + withdrawal) - tax(income)`, with no rebates. Net payout after the fund fee and any SARS debt, the effective rate, a note when the withdrawal moves the top of the income into a higher bracket, and a payout bar
- **Cost at retirement:** the gross withdrawal compounded annually to retirement, in future rand and in today's money
- **Contribution split:** one third to savings and two thirds to retirement, monthly and yearly
- Validation: R2 000 minimum, withdrawal no more than the savings balance, no negative numbers or text, whole-year ages, retirement age greater than current age
- Calculates when the visitor presses Calculate or Enter. Inputs never leave the browser
- Tax brackets, the tax year label and the "Last updated" date are in `CONFIG`

The H1 is part of the snippet. If your theme also prints the page title as an H1, hide the theme title on this page so there is only one H1.

### Testing

`tests/two-pot-calculator.test.js` runs every test case in the build spec, plus validation and page checks, against the real page in a browser:

```
npm install playwright
npx playwright install chromium
node tests/two-pot-calculator.test.js
```

Re-run it after updating the tax brackets.

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
