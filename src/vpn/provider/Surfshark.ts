import axios from 'axios';
import { execSync } from 'child_process';
import fs from 'fs';
import { Provider } from './Provider';
import { RegisterInfo, SurfsharkConfig, WireguardCredentials } from './Surfshark.model';
import { dnsLookup } from '../../util';


export class Surfshark {

  static async login(): Promise<string> {
    const url = "https://api.surfshark.com/v1/auth/login";

    require('dotenv').config();

    const body = {
      username: process.env.SURFSHARK_USERNAME,
      password: process.env.SURFSHARK_PASSWORD
    };

    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept-Encoding': 'application/json'
    }

    const resp = await axios.post(url, body, { headers: headers });
    const token = resp.data.token;
    return token;
  }

  static generate_wireguard(path: string): WireguardCredentials {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
      execSync(`wg genkey | tee ${path}/privatekey | wg pubkey > ${path}/publickey`);
    }

    const privKey = fs.readFileSync(`${path}/privatekey`, 'utf-8').trim();
    const pubKey = fs.readFileSync(`${path}/publickey`, 'utf-8').trim();
    return { privKey, pubKey };
  }

  static async registerWireguard(path: string, token: string, pubKey: string): Promise<RegisterInfo> {
    let url = "https://api.surfshark.com/v1/account/users/public-keys";

    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept-Charset': 'utf-8',
      'Ss-Variant-Slugs': 'test_36:b;test_34:a;test_41:b;feature_1:b;test_28:a;feature_chat_apple:b;feature_shadowsocks:b;test_50:a;test_55:b;feature_rotator:a;test108:b',
      'Accept-Language': 'en-US;q=1.0',
      'Accept-Encoding': 'application/json',
      'User-Agent': 'Surfshark/2.24.0 (com.surfshark.vpnclient.ios; build:19; iOS 14.8.1) Alamofire/5.4.3 device/mobile',
    };

    const jsonPath = `${path}/register.json`;

    // check if wireguard is registered successfully
    if (fs.existsSync(jsonPath)) {
      const register: RegisterInfo = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      const now = new Date();
      if (register.expiresAt > now) {
        return register;
      }
    }

    // register wireguard and save to file
    const resp = await axios.post(url, { pubKey }, { headers: headers });
    const registry = Object.assign({}, resp.data, { expiresAt: new Date(resp.data.expiresAt) });
    fs.writeFileSync(jsonPath, JSON.stringify(registry));
    return registry;
  }

  static async downloadWireguardConfigs(path: string, privKey: string) {
    const url = "https://api.surfshark.com/v4/server/clusters/generic";
    const headers = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
      'Accept-Encoding': 'application/json',
    };

    const confPath = `${path}/wireguard_configs`;

    if (!fs.existsSync(confPath)) {
      fs.mkdirSync(confPath);
    }

    const resp = await axios.get(url, { headers: headers });
    const surfsharkConfigs: SurfsharkConfig[] = resp.data;


    for (const conf of surfsharkConfigs) {
      const ip = await dnsLookup(conf.connectionName);
      const data = `[Interface]\nPrivateKey = ${privKey}\nAddress = 10.14.0.2/16\nDNS = 162.252.172.57, 149.154.159.92\n\n[Peer]\nPublicKey = ${conf.pubKey} \nAllowedIps= 0.0.0.0/0\nEndpoint = ${ip}:51820`;
      fs.writeFileSync(`${confPath}/${conf.connectionName}.conf`, data);
    }

  }


  static async downloadConfigs(path: string) {
    const url = "https://my.surfshark.com/vpn/api/v1/server/configurations";
    await Provider.downloadConfigs(path, url);
  }

  static async init(path: string) {
    if (Provider.isEmpty(path)) {
      await this.downloadConfigs(path);
      Provider.addAuthTxtPathToConfigs(path);
    }
    Provider.createAuthTxtFromEnv(path);
  }

  static getConfigs(path: string) {
    return Provider.getConfigs(path);
  }
}