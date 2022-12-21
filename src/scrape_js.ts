import { Request, Response } from "express";
import { chromium } from "playwright-chromium";
import { PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, USER_AGENT } from "./config";
import { state } from "./state";

export default async (req: Request, res: Response) => {
  if (state.isBusy()) {
    res.status(500).send('Server is busy');
    return;
  }

  let url = '';
  let waitMs = 0;

  try {

    url = req.body.url;
    waitMs = req.body.waitMs || 0;
  } catch (e) {
    res.status(401).send('Missing url');
    return;
  }

  let browser = undefined;
  state.setBusy();

  try {
    browser = await chromium.launch({ executablePath: PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
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
    await browser.close();

    state.setNotBusy();

    res.send(html);
  } catch (e) {
    if (browser) {
      await browser.close();
    }

    state.setNotBusy();

    res.status(500).send(e);
  }
}