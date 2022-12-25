import { Request, Response } from "express";
import { Browser, chromium } from "playwright-chromium";
import { PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, USER_AGENT } from "./config";
import { busyCheck, state } from "./state";
import { urlCheck } from "./util";

export const scrapeJs = async (browser: Browser, url: string, waitMs: number) => {

  try {
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

    return html;
  } catch (e) {
    if (browser) {
      await browser.close();
    }
    throw e;

  }

}

export const apiScrapeJs = async (req: Request, res: Response) => {
  busyCheck(res);

  const url = urlCheck(req, res);
  const waitMs = req.body.waitMs || 0;

  try {

    state.setBusy();
    const html = await scrapeJs(state.browser(), url, waitMs);
    state.setNotBusy();

    res.send(html);
  } catch (e) {
    state.setNotBusy();
    res.status(500).send(e);
  }


}