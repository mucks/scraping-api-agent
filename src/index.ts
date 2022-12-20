import { OpenVpn } from "./openvpn"
import { VpnPool } from "./vpn/VpnPool"
import express from 'express';
import axios from "axios";
import { chromium } from "playwright-chromium";
import { createDirs } from "./util";

const USE_VPN = process.env.USE_VPN;

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
const app = express();
app.use(express.json());


app.post('/scrape', async (req, res) => {
  let url = '';
  try {
    url = req.body.url;
  } catch (e) {
    console.log(e);
    res.status(401).send('Missing url');
    return;
  }

  try {
    console.log(url);
    const resp = await axios.get(url, { headers: { 'User-Agent': USER_AGENT } });
    res.send(resp.data);
  } catch (e) {
    res.status(500).send(e);
  }
});

//main
(async () => {
  require('dotenv').config()
  createDirs();

  if (USE_VPN) {
    await VpnPool.init();
    let vpn = VpnPool.get_random_vpn();
    await OpenVpn.connect(vpn);
    console.log('connected');
  }



  app.post('/scrape-js', async (req, res) => {
    let url = '';
    let waitMs = 0;

    try {
      url = req.body.url;
      waitMs = req.body.waitMs || 0;
    } catch (e) {
      res.status(401).send('Missing url');
      return;
    }

    let browser = null;

    try {
      browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
      console.log('chromium launched');
      const context = await browser.newContext({ userAgent: USER_AGENT });
      const page = await context.newPage();
      await page.goto(url);
      await page.waitForTimeout(waitMs);
      const html = await page.content();
      await page.close();
      await context.close();
      await browser.close();

      res.send(html);
    } catch (e) {
      if (browser) {
        await browser.close();
      }
      res.status(500).send(e);
    }

  });

  const port = 4000;

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });

})()