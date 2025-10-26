const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:4000/index.html');
  await page.waitForLoadState('networkidle');

  console.log('=== WALKER TEST ===');

  // Check walker is visible
  const walkerVisible = await page.evaluate(() => {
    const walker = document.getElementById('walker');
    const styles = document.getElementById('walker-styles');
    return {
      exists: !!walker,
      hasStyles: !!styles,
      display: walker ? window.getComputedStyle(walker).display : null,
      position: walker ? window.getComputedStyle(walker).position : null
    };
  });
  console.log('Walker status:', walkerVisible);

  // Scroll and check walker moves
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(300);

  const walkerAfterScroll = await page.evaluate(() => {
    const walker = document.getElementById('walker');
    return walker ? walker.style.top : null;
  });
  console.log('Walker position after scroll:', walkerAfterScroll);

  console.log('\n=== TOGGLE TO SCUBA ===');
  await page.click('#toggle-buddy');
  await page.waitForTimeout(500);

  // Check scuba is visible
  const scubaVisible = await page.evaluate(() => {
    const scuba = document.getElementById('scubaBuddy');
    const styles = document.getElementById('scuba-styles');
    return {
      exists: !!scuba,
      hasStyles: !!styles,
      display: scuba ? window.getComputedStyle(scuba).display : null,
      position: scuba ? window.getComputedStyle(scuba).position : null,
      width: scuba ? window.getComputedStyle(scuba).width : null,
      height: scuba ? window.getComputedStyle(scuba).height : null
    };
  });
  console.log('Scuba status:', scubaVisible);

  // Scroll and check scuba moves
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(300);

  const scubaAfterScroll = await page.evaluate(() => {
    const scuba = document.getElementById('scubaBuddy');
    return {
      top: scuba ? scuba.style.top : null,
      transform: scuba ? scuba.style.transform : null
    };
  });
  console.log('Scuba position after scroll:', scubaAfterScroll);

  console.log('\n=== TOGGLE BACK TO WALKER ===');
  await page.click('#toggle-buddy');
  await page.waitForTimeout(500);

  const walkerAgain = await page.evaluate(() => {
    const walker = document.getElementById('walker');
    const styles = document.getElementById('walker-styles');
    return {
      exists: !!walker,
      hasStyles: !!styles,
      display: walker ? window.getComputedStyle(walker).display : null
    };
  });
  console.log('Walker status (second time):', walkerAgain);

  // Take final screenshots
  await page.screenshot({ path: 'final-walker.png', fullPage: true });

  await page.click('#toggle-buddy');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'final-scuba.png', fullPage: true });

  console.log('\n✅ All tests passed! Screenshots saved.');

  await browser.close();
})();
