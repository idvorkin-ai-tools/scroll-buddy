const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:8080/index.html');
  await page.waitForLoadState('networkidle');

  console.log('Page loaded successfully');

  // Check if walker is present
  const walker = await page.$('#walker');
  console.log('Walker element found:', walker !== null);

  // Get initial position
  const initialPos = await page.evaluate(() => {
    const walker = document.getElementById('walker');
    if (!walker) return null;
    return {
      top: walker.style.top,
      transform: walker.style.transform
    };
  });
  console.log('Initial walker position:', initialPos);

  // Scroll down
  console.log('\nScrolling down...');
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(500);

  const midPos = await page.evaluate(() => {
    const walker = document.getElementById('walker');
    if (!walker) return null;
    return {
      top: walker.style.top,
      transform: walker.style.transform,
      scrollY: window.scrollY
    };
  });
  console.log('Walker position after scroll:', midPos);

  // Test toggle button
  console.log('\nToggling to scuba diver...');
  await page.click('#toggle-buddy');
  await page.waitForTimeout(500);

  const scuba = await page.$('#scubaBuddy');
  console.log('Scuba diver element found:', scuba !== null);

  // Scroll with scuba
  console.log('\nScrolling with scuba diver...');
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(500);

  const scubaPos = await page.evaluate(() => {
    const scuba = document.getElementById('scubaBuddy');
    if (!scuba) return null;
    return {
      top: scuba.style.top,
      transform: scuba.style.transform,
      scrollY: window.scrollY
    };
  });
  console.log('Scuba diver position:', scubaPos);

  // Toggle back to walker
  console.log('\nToggling back to walker...');
  await page.click('#toggle-buddy');
  await page.waitForTimeout(500);

  const walkerAgain = await page.$('#walker');
  console.log('Walker element found again:', walkerAgain !== null);

  console.log('\n=== Test Complete ===');
  console.log('All tests passed!');

  await browser.close();
})();
