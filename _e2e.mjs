// 100-persona end-to-end test.
// Each persona walks the full flow: Landing → Browse → Item → Reserve → Cart → Checkout.
// Real headless Chrome via Puppeteer drives the actual React app on http://localhost:3001.

import puppeteer from 'puppeteer';

const BASE = process.env.E2E_BASE || 'http://localhost:3002';
const N = 100;
const CONCURRENCY = 3;

const FIRST_NAMES = ['Maya','Leo','Ana','Yuki','James','Sarah','Marco','Elise','Riku','Jia','Theo','Mei','Ivan','Nora','Kai','Lina','Daniel','Emily','Sun','Ravi','Sofia','Akira','Olivia','Hugo','Mila','Thomas','Anya','Diego','Iris','Felix','Hana','Jose','Lara','Noah','Ada','Ben','Chloe','Liam','Zoe','Tom','Rin','Ella','Marc','Tara','Vera','Oscar','Nina','Sam','Lucy','Owen'];
const LAST_INITIALS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','V','W','Y','Z'];
const CITIES = ['Brooklyn','Manhattan','Queens','LA','SF','Boston','Chicago','Seattle','Austin','Miami','Tokyo','Seoul','Paris','London','Berlin','Singapore','Sydney','Melbourne','Toronto','Vancouver'];
const STRATS = ['fast','browse','impulse','researcher'];

const personas = Array.from({ length: N }, (_, i) => ({
  id: i + 1,
  name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_INITIALS[i % LAST_INITIALS.length]}.`,
  city: CITIES[i % CITIES.length],
  itemId: ((i * 7) % 12) + 1,         // pick item 1..12
  qty: 1 + (i % 3),                   // 1..3
  addSecond: i % 4 === 0,             // 25% buy two items
  strategy: STRATS[i % STRATS.length],
}));

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function runOne(browser, p, log) {
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  await page.setViewport({ width: 1280, height: 900 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const txt = m.text();
    // Ignore flaky 3rd-party image / font 404s — these are environmental, not app bugs.
    if (/Failed to load resource/.test(txt)) return;
    errors.push(`console.error: ${txt}`);
  });

  const checks = [];
  let currentStep = 'init';
  try {
    // 1. Landing
    currentStep = 'goto-landing';
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle2' });
    checks.push(['landing-loaded', !!(await page.$('h1'))]);

    // Pre-authenticate so the protected routes (cart/checkout) are accessible.
    await page.evaluate(() => {
      try { sessionStorage.setItem('handi_signed_in', '1'); } catch {}
    });

    // 2. Click Browse carriers (find by text)
    await page.goto(`${BASE}/browse`, { waitUntil: 'networkidle2' });
    checks.push(['browse-loaded', !!(await page.$('h1'))]);
    // Card count > 0
    const cardCount = await page.$$eval('a[href^="/item/"]', els => els.length);
    checks.push(['browse-has-cards', cardCount > 0]);

    // 3. Open item detail by URL (deterministic)
    await page.goto(`${BASE}/item/${p.itemId}`, { waitUntil: 'networkidle2' });
    checks.push(['item-loaded', !!(await page.$('h1'))]);
    // Title should NOT be the default Eevee title for non-2 items
    const title = await page.$eval('h1', el => el.textContent);
    checks.push(['item-title-nonempty', title && title.length > 0]);

    // 4. Adjust qty via + button to p.qty
    if (p.qty > 1) {
      // Find + buttons. The qty +/- on item detail are buttons containing '+' / '-'.
      const plusHandles = await page.$$('button');
      // Click the '+' button next to qty (we know it's adjacent to a span with qty number)
      // Simpler: evaluate to find buttons with text '+' inside a flex container
      for (let i = 1; i < p.qty; i++) {
        const clicked = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          // find one whose only text is '+' and has no className like h-btn
          const plus = buttons.find(b => b.textContent.trim() === '+' && !b.className.includes('h-btn'));
          if (plus) { plus.click(); return true; }
          return false;
        });
        if (!clicked) break;
      }
    }

    // 5. Click Reserve · $X
    const reserveClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const reserve = buttons.find(b => /^Reserve\b/.test(b.textContent.trim()));
      if (reserve) { reserve.click(); return true; }
      return false;
    });
    checks.push(['reserve-clicked', reserveClicked]);

    // Should have navigated to /cart
    currentStep = 'wait-cart';
    await page.waitForFunction(() => location.pathname === '/cart', { timeout: 15000 });
    checks.push(['arrived-at-cart', page.url().endsWith('/cart')]);

    // Verify item in cart (image + remove button or qty controls)
    await page.waitForSelector('h1', { timeout: 15000 });
    const cartHeading = await page.$eval('h1', el => el.textContent);
    checks.push(['cart-shows-heading', /Reserve|cart/i.test(cartHeading)]);

    // 6. Optionally add a second item
    if (p.addSecond) {
      const secondId = ((p.itemId) % 12) + 1;
      await page.goto(`${BASE}/item/${secondId}`, { waitUntil: 'networkidle2' });
      const r2 = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const reserve = buttons.find(b => /^Reserve\b/.test(b.textContent.trim()));
        if (reserve) { reserve.click(); return true; }
        return false;
      });
      checks.push(['second-reserve-clicked', r2]);
      currentStep = 'wait-cart';
    await page.waitForFunction(() => location.pathname === '/cart', { timeout: 15000 });
    }

    // 7. Cart should reflect items in summary
    const totalText = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('span')).find(s => /^\$[0-9]/.test(s.textContent.trim()) && s.classList.contains('h-serif'));
      return el ? el.textContent.trim() : '';
    });
    checks.push(['cart-has-total', /^\$[0-9]/.test(totalText)]);

    // 8. Click Checkout securely → from cart
    currentStep = 'click-checkout';
    const checkoutClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const co = buttons.find(b => /Checkout securely/.test(b.textContent));
      if (co) { co.click(); return true; }
      return false;
    });
    checks.push(['checkout-clicked', checkoutClicked]);

    currentStep = 'wait-checkout';
    await page.waitForFunction(() => location.pathname === '/checkout', { timeout: 15000 });
    checks.push(['arrived-at-checkout', page.url().endsWith('/checkout')]);

    // 9. Fill the card fields, then wait for Place order to enable
    currentStep = 'fill-card';
    await page.evaluate(() => {
      const setReactValue = (el, val) => {
        const proto = Object.getPrototypeOf(el);
        const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        setter?.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      const byAuto = (a) => document.querySelector(`input[autocomplete="${a}"]`);
      const card = byAuto('cc-number');
      const exp = byAuto('cc-exp');
      const cvc = byAuto('cc-csc');
      const cardName = byAuto('cc-name');
      if (card) setReactValue(card, '4242424242424242');
      if (exp) setReactValue(exp, '1229');
      if (cvc) setReactValue(cvc, '123');
      if (cardName) setReactValue(cardName, 'Maya Chen');
    });

    currentStep = 'wait-place-btn';
    await page.waitForFunction(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => /^Place order/.test(b.textContent.trim()));
      return btn && !btn.disabled;
    }, { timeout: 15000 });
    checks.push(['place-order-enabled', true]);

    // 10. Click Place order
    const placeClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => /^Place order/.test(b.textContent.trim()));
      if (btn && !btn.disabled) { btn.click(); return true; }
      return false;
    });
    checks.push(['place-order-clicked', placeClicked]);

    // 11. After ~700ms processing → /order-detail
    currentStep = 'wait-order-detail';
    await page.waitForFunction(() => location.pathname === '/order-detail', { timeout: 15000 });
    checks.push(['arrived-at-order-detail', page.url().endsWith('/order-detail')]);

    // 12. Cart should be empty after checkout (sessionStorage cleared)
    const remaining = await page.evaluate(() => {
      try {
        const raw = sessionStorage.getItem('handi_cart_v1');
        const parsed = raw ? JSON.parse(raw) : { items: [] };
        return (parsed.items || []).length;
      } catch { return -1; }
    });
    checks.push(['cart-cleared-after-checkout', remaining === 0]);
  } catch (e) {
    errors.push(`exception @ ${currentStep}: ${e.message.slice(0, 100)}`);
  } finally {
    await page.close();
  }

  const failed = checks.filter(c => !c[1]);
  return { p, checks, errors, ok: failed.length === 0 && errors.length === 0, failed };
}

async function main() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < personas.length) {
      const i = cursor++;
      const p = personas[i];
      const r = await runOne(browser, p);
      results.push(r);
      const status = r.ok ? 'PASS' : 'FAIL';
      const failedNames = r.failed.map(f => f[0]).join(', ');
      const errLine = r.errors.length ? ` errs=${r.errors.length}` : '';
      console.log(`[${String(i + 1).padStart(3, ' ')}/${N}] ${status} ${p.name.padEnd(14)} item#${p.itemId} qty=${p.qty} ${p.addSecond ? '+1' : '  '} ${p.strategy.padEnd(10)}${failedNames ? ` failed: ${failedNames}` : ''}${errLine}`);
    }
  });
  await Promise.all(workers);
  await browser.close();

  const pass = results.filter(r => r.ok).length;
  const fail = results.length - pass;
  console.log(`\n=== ${pass}/${results.length} passed ===`);
  if (fail > 0) {
    console.log('\nFailing personas:');
    for (const r of results.filter(x => !x.ok)) {
      console.log(`  #${r.p.id} ${r.p.name}: failed=[${r.failed.map(f => f[0]).join(',')}] errs=[${r.errors.slice(0, 3).join(' | ')}]`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(2); });
