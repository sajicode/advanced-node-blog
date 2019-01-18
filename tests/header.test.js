const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
	browser = await puppeteer.launch({
		headless: false,
		args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
	});
	page = await browser.newPage();
	await page.goto('localhost:3000');
});

afterEach(async () => {
	await browser.close();
});
// all operations with puppeteer are async
test('we can launch a browser', async () => {
	const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);

	expect(text).toEqual('Blogster');
});
