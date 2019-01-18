const puppeteer = require('puppeteer');

test('adds two numbers', () => {
	const sum = 1 + 2;

	expect(sum).toEqual(3);
});

// all operations with puppeteer are async
test(
	'we can launch a browser',
	async () => {
		const browser = await puppeteer.launch({
			headless: true,
			args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
		});
		const page = await browser.newPage();
	},
	30000
);
