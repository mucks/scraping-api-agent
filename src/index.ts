import { OpenVpn } from "./vpn/openvpn"
import express from 'express';
import { createDirs } from "./util";
import { USE_VPN } from "./config";
import scrape_js from "./scrape_js";
import scrape from "./scrape";
import { state } from "./state";
import { Provider } from "./vpn/provider/Provider";


const app = express();
app.use(express.json());


//main
(async () => {
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
    await scrape(req, res);
  });

  // scrape with playwright
  app.post('/scrape-js', async (req, res) => {
    await scrape_js(req, res);
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

})()