const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto('localhost:3000');
});

afterEach(async () => {
	await page.close();
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

test('when signed in, shows logout button', async () => {
	const user = await userFactory();

	const { session, sig } = sessionFactory(user);

	// set cookies on chromium header
	await page.setCookie({ name: 'session', value: session });
	await page.setCookie({ name: 'session.sig', value: sig });
	await page.goto('localhost:3000');
	await page.waitFor('a[href="/auth/logout"]');

	const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

	expect(text).toEqual('Logout');
});
