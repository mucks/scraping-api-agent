import { OpenVpn } from "./vpn/OpenVpn"
import express from 'express';
import { createDirs } from "./util";
import { USE_VPN, VPN_PROTOCOL } from "./config";
import { state } from "./state";
import { Provider } from "./vpn/provider/Provider";
import { apiScrape } from "./scrape";
import { apiScrapeJs } from "./scrape_js";
import { WireGuard } from "./vpn/WireGuard";

const app = express();
app.use(express.json());

async function main() {
  createDirs();

  state.setBusy();



  if (USE_VPN) {
    try {
      const vpnProvider = new Provider();
      await vpnProvider.init();
      const vpn = vpnProvider.get_random_vpn();
      switch (VPN_PROTOCOL) {
        case 'openvpn':
          await OpenVpn.connect(vpn);
          break;
        case 'wireguard':
          await WireGuard.connect(vpn);
          break;
      }
      console.log(`connected to vpn: ${vpn}`);
    } catch (e) {
      console.error(e);
      return;
    }
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
  await main();
})()