// Runs the build-spec test cases against two-pot-calculator.html in a real browser.
// The suite runs twice: on the file as-is, and on a copy with every backslash removed,
// which is what the Divi Code module does to pasted code.
// Usage: npm install playwright, then: node tests/two-pot-calculator.test.js
// (Set CHROMIUM_PATH to use an already installed Chromium.)
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');

const original = fs.readFileSync(path.join(__dirname, '..', 'two-pot-calculator.html'), 'utf8');
function writePage(name, snippet) {
  const file = path.join(os.tmpdir(), name);
  fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Test</title></head><body style="font-family:sans-serif;margin:0;padding:16px">' + snippet + '</body></html>');
  return file;
}
const variants = [
  ['as written', writePage('two-pot-test-page.html', original)],
  ['Divi (backslashes stripped)', writePage('two-pot-test-page-divi.html', original.split(String.fromCharCode(92)).join(''))]
];

const R = n => 'R' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
let failures = 0;
function check(name, actual, expected) {
  const pass = actual === expected;
  if (!pass) failures++;
  console.log((pass ? 'PASS ' : 'FAIL ') + name + (pass ? '' : `  expected "${expected}", got "${actual}"`));
}

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const [variant, page] of variants) {
  console.log('\n===== ' + variant + ' =====');
  const p = await browser.newPage({ viewport: { width: 390, height: 900 } });
  const errors = [];
  const requests = [];
  p.on('pageerror', e => errors.push(e.message));
  p.on('request', r => { if (!r.url().startsWith('file:')) requests.push(r.url()); });
  await p.goto('file://' + page);

  const text = id => p.$eval('#' + id, el => el.textContent.trim());
  const visible = id => p.$eval('#' + id, el => !el.hidden);
  async function run(values, useEnter) {
    for (const id of ['income', 'wd', 'fee', 'debt', 'bal', 'age', 'ret', 'contrib']) await p.fill('#tpw-' + id, '');
    await p.fill('#tpw-growth', '9');
    await p.fill('#tpw-infl', '5');
    for (const [k, v] of Object.entries(values)) await p.fill('#tpw-' + k, String(v));
    if (useEnter) await p.press('#tpw-wd', 'Enter'); else await p.click('button.tpw-btn');
  }

  console.log('--- Part 1: tax and net payout');
  const part1 = [
    [380000, 50000, 15345, 34655, '30.7%'],
    [150000, 20000, 3600, 16400, '18.0%'],
    [250000, 20000, 5200, 14800, '26.0%'],
    [600000, 30000, 10800, 19200, '36.0%'],
    [1200000, 50000, 20500, 29500, '41.0%'],
    [380000, 2000, 520, 1480, '26.0%'],
    [240000, 30000, 7392, 22608, '24.6%'],
    [380000, 30000, 9145, 20855, null]
  ];
  for (const [i, [income, wd, tax, net, eff]] of part1.entries()) {
    await run({ income, wd }, i === 0);
    const label = `income ${income}, withdrawal ${wd}`;
    check(label + ': tax', await text('tpw-o-tax'), R(tax));
    check(label + ': net', await text('tpw-o-net'), R(net));
    if (eff) check(label + ': effective', await text('tpw-o-eff'), eff);
  }

  console.log('--- Part 1: bracket note');
  await run({ income: 380000, wd: 50000 });
  check('note shown when rates differ', await text('tpw-o-rates'), 'Your income is taxed at 26 percent. With this withdrawal, the top of your income is taxed at 31 percent.');
  await run({ income: 600000, wd: 30000 });
  check('note hidden when rates match', await visible('tpw-o-rates'), false);

  console.log('--- Part 1: fees, SARS debt and negative payout');
  await run({ income: 250000, wd: 20000, fee: 300, debt: 1000 });
  check('net after fee and debt', await text('tpw-o-net'), R(20000 - 5200 - 300 - 1000));
  await run({ income: 250000, wd: 20000, debt: 30000 });
  check('net floors at 0', await text('tpw-o-net'), 'R0');
  check('debt note shown', await visible('tpw-o-neg'), true);

  console.log('--- Validation');
  await run({ income: 250000, wd: 1500 });
  check('minimum withdrawal', await text('tpw-wd-err'), 'The minimum two-pot withdrawal is R2 000.');
  await run({ income: 250000, wd: 20000, bal: 10000 });
  check('withdrawal above balance', await text('tpw-wd-err'), 'You cannot withdraw more than your savings component balance.');
  await run({ income: 250000, wd: 2000, bal: 1500 });
  check('balance below minimum', await text('tpw-bal-err'), 'A savings withdrawal needs a balance of at least R2 000.');
  await run({ income: '-5000', wd: 20000 });
  check('negative rejected', await visible('tpw-income-err'), true);
  await run({ income: 'abc', wd: 20000 });
  check('text rejected', await visible('tpw-income-err'), true);
  await run({ income: '380 000', wd: '30,000' });
  check('spaces and commas accepted', await text('tpw-o-tax'), R(9145));
  await run({ income: 250000, wd: 20000, age: 60, ret: 60 });
  check('retirement age must be greater', await visible('tpw-ret-err'), true);
  await run({ income: 250000, wd: 20000, age: 35.5, ret: 65 });
  check('whole-year age', await visible('tpw-age-err'), true);

  console.log('--- Part 2: cost at retirement');
  const part2 = [
    [30000, 35, 65, 398030, 92095],
    [30000, 55, 65, 71021, 43601],
    [20000, 45, 65, 112088, 42245],
    [50000, 50, 65, 182124, 87605]
  ];
  for (const [wd, age, ret, fv, today] of part2) {
    await run({ income: 250000, wd, age, ret });
    const label = `withdrawal ${wd}, ${ret - age} years`;
    check(label + ': future', await text('tpw-o-fv'), R(fv));
    check(label + ': today', await text('tpw-o-today'), R(today));
  }
  check('sentence', await text('tpw-o-sentence'), 'Taking R50 000 now could cost you about R87 605 in today\'s money at age 65.');

  console.log('--- Part 3: contribution split');
  await run({ income: 250000, wd: 20000, contrib: 3000 });
  check('savings per month', await text('tpw-o-sm'), 'R1 000');
  check('retirement per month', await text('tpw-o-rm'), 'R2 000');
  check('savings per year', await text('tpw-o-sy'), 'R12 000');
  check('retirement per year', await text('tpw-o-ry'), 'R24 000');

  console.log('--- Page');
  check('one H1', await p.$$eval('h1', h => h.length), 1);
  check('portfolio review link', await p.$eval('#tpw-cta', a => a.href), 'https://www.pensionfund.co.za/contact/');
  check('no horizontal scroll at 390px', await p.evaluate(() => document.documentElement.scrollWidth <= 390), true);
  check('no network requests', requests.length, 0);
  check('no script errors', errors.length, 0);
  check('Calculate never leaves the page', p.url(), 'file://' + page);
  await p.close();
  }

  await browser.close();
  console.log(failures ? `\n${failures} FAILED` : '\nAll checks passed');
  process.exit(failures ? 1 : 0);
})();
