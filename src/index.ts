import { OpenVpn } from "./openvpn"
import { VpnPool } from "./vpn/VpnPool"
import express from 'express';
import { createDirs } from "./util";
import { USE_VPN } from "./config";
import scrape_js from "./scrape_js";
import scrape from "./scrape";
import { state } from "./state";


const app = express();
app.use(express.json());


//main
(async () => {
  require('dotenv').config()
  createDirs();

  state.setBusy();

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