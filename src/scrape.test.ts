import { scrape } from './scrape';

test('testing scrape', async () => {
  const url = 'https://www.google.com/';
  const data = await scrape(url);
});