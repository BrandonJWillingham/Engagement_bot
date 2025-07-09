import puppeteer from 'puppeteer-extra';
import { getRandomInt } from './helpers/random.js';
import { delay } from './helpers/delay.js';
import { loginOnce } from './helpers/logInOnce.js';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { engage } from './actions/engage.js';
puppeteer.use(StealthPlugin());

async function runBot() {
  const USERNAME = "willcunnings41@gmail.com"
  const PASSWORD = "MyHero2025"
  const browser = await puppeteer.launch({ headless: false, ignoreDefaultArgs: ["--enable-automation"]});
  const page = await browser.newPage();
  console.log(await page.evaluate('navigator.webdriver'))
  await page.goto('https://www.instagram.com/accounts/login/');
  await delay(1000 + getRandomInt(1,9)* 100);
  // // try up to 3 times
  let loggedIn = false;
  for (let attempt = 1; attempt <= 3 && !loggedIn; attempt++) {
    console.log(`Login attempt #${attempt}`);
    loggedIn = await loginOnce(page, USERNAME, PASSWORD);
    if (!loggedIn) {
      // wait a bit before retrying
      await delay(2000 + Math.random() * 3000);
    }
  }

  if (!loggedIn) {
    console.error('All login attempts failed. Exiting.');
    await browser.close();
    return;
  }

  // now you’re logged in—carry on
  await delay(1000);
  while (true) {
    await engage(page);
  }
}

runBot();