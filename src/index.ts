import { OpenVpn } from "./vpn/openvpn"
import express from 'express';
import { createDirs } from "./util";
import { USE_VPN } from "./config";
import { state } from "./state";
import { Provider } from "./vpn/provider/Provider";
import { apiScrape } from "./scrape";
import { apiScrapeJs } from "./scrape_js";
import { Surfshark } from "./vpn/provider/Surfshark";
import { writeFileSync } from "fs";

const app = express();
app.use(express.json());

async function main() {
  createDirs();

  state.setBusy();

  const vpnProvider = new Provider();
  await vpnProvider.init();
  const vpn = vpnProvider.get_random_vpn();

  if (USE_VPN) {
    await OpenVpn.connect(vpn);
    console.log(`connected to vpn: ${vpn}`);
  }

  // scrape with axios
  app.post('/scrape', async (req, res) => {
    await apiScrape(req, res);
  });

  // scrape with playwright
  app.post('/scrape-js', async (req, res) => {
    await apiScrapeJs(req, res);
  });

  // check if the server is currently busy
  app.get('/is-busy', async (req, res) => {
    res.send('' + state.isBusy());
  });

  //shutdown the server / container
  app.delete('/shutdown', async (req, res) => {
    res.send('Shutting down');
    process.exit(0);
  });

  const port = 4000;

  app.listen(port, () => {
    state.setNotBusy();
    console.log(`listening on port ${port}`);
  });
}

(async () => {
  //await main();
})()