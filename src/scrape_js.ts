import { Request, Response } from "express";
import { Browser } from "playwright-chromium";
import { USER_AGENT } from "./config";

export default async (req: Request, res: Response, browser?: Browser) => {
  let url = '';
  let waitMs = 0;

  try {
    url = req.body.url;
    waitMs = req.body.waitMs || 0;
  } catch (e) {
    res.status(401).send('Missing url');
    return;
  }


  try {
    console.log('chromium launched');
    if (!browser) {
      throw new Error('Browser not initialized');
    }

    const context = await browser.newContext({ userAgent: USER_AGENT });
    const page = await context.newPage();

    // Disable images, css, fonts, etc.
    const RESOURCE_EXCLUSTIONS = ['image', 'stylesheet', 'media', 'font', 'other'];
    await page.route('**/*', (route) => {
      return RESOURCE_EXCLUSTIONS.includes(route.request().resourceType())
        ? route.abort()
        : route.continue()
    });

    await page.goto(url);
    await page.waitForTimeout(waitMs);
    const html = await page.content();
    await page.close();
    await context.close();
    //await browser.close();

    res.send(html);
  } catch (e) {
    if (browser) {
      await browser.close();
    }
    res.status(500).send(e);
  }
}