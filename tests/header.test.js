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
test('the header has the correct test', async () => {
	const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);

	expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
	await page.click('.right a');

	const url = await page.url();

	expect(url).toMatch(/accounts\.google\.com/);
});
