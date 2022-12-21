import { OpenVpn } from "./openvpn"
import { VpnPool } from "./vpn/VpnPool"
import express from 'express';
import axios from "axios";
import { Browser, chromium } from "playwright-chromium";
import { createDirs } from "./util";
import { PRODUCTION, USER_AGENT, USE_VPN } from "./config";
import scrape_js from "./scrape_js";
import scrape from "./scrape";

let browser: Browser | undefined;

const app = express();
app.use(express.json());


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

  // scrape with axios
  app.post('/scrape', async (req, res) => {
    await scrape(req, res);
  });

  // always keep browser running
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, headless: PRODUCTION });
  // scrape with playwright
  app.post('/scrape-js', async (req, res) => {
    scrape_js(req, res, browser);
  });

  const port = 4000;

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });

})()