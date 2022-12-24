import { scrapeJs } from './scrape_js';

test('testing scrape_js', async () => {
  const url = 'https://www.google.com/';
  const data = await scrapeJs(url, 0);
});