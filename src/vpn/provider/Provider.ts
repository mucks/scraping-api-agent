import fs from 'fs';
import axios from 'axios';
import decompress from 'decompress'
import { VPN_FILTER, VPN_PROVIDER, VPN_PROVIDER_PASSWORD, VPN_PROVIDER_USERNAME } from '../../config';
import { Surfshark } from './Surfshark';
import { PureVpn } from './PureVpn';
import { NordVpn } from './NordVpn';


export class Provider {
  configs: string[] = [];
  async init() {
    const path = './vpn_configs';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    switch (VPN_PROVIDER) {
      case 'surfshark':
        await Surfshark.init(path);
        this.configs = Surfshark.getConfigs(path);
        break;
      case 'purevpn':
        await PureVpn.init(path);
        this.configs = PureVpn.getConfigs(path);
        break;
      case 'nordvpn':
        await NordVpn.init(path);
        this.configs = NordVpn.getConfigs(path);
        break;
    }
  }

  get_random_vpn() {
    if (VPN_FILTER) {
      const allowed = VPN_FILTER.split(',');
      console.log(allowed);
      const filtered = this.configs.filter(c => {
        const name = c.substring(c.lastIndexOf('/') + 1);
        const country = name.split('-')[0];
        return allowed.includes(country);
      });
      const random = Math.floor(Math.random() * filtered.length);
      const vpn = filtered[random];
      if (!vpn) {
        throw `could not find vpn with filter: ${VPN_FILTER}`;
      }
      return vpn;
    }
    const random = Math.floor(Math.random() * this.configs.length);
    return this.configs[random];
  }


  static async downloadConfigs(path: string, url: string) {
    fs.mkdirSync(path, { recursive: true });
    const resp = await axios.get(url, { responseType: 'arraybuffer' });

    const tmpFilePath = `${path}/download.zip`;

    fs.writeFileSync(tmpFilePath, resp.data);
    await decompress(tmpFilePath, path);
    fs.unlinkSync(tmpFilePath);
  }

  static addAuthTxtPathToConfigs(path: string) {
    const files = fs.readdirSync(path);
    files.forEach(file => {
      if (file.endsWith('.ovpn')) {
        const ovpn_file_path = `${path}/${file}`;
        let data = fs.readFileSync(ovpn_file_path, 'utf-8');
        data = data.replace('auth-user-pass', `auth-user-pass ${path}/auth.txt`);

        fs.writeFileSync(ovpn_file_path, data);
      }
    });
  }

  static moveAllOvpnFiles(src: string, dest: string) {
    for (const file of fs.readdirSync(src)) {
      if (file.endsWith('.ovpn')) {
        fs.renameSync(`${src}/${file}`, `${dest}/${file}`);
      }
    }
  };

  static async createAuthTxtFromEnv(path: string) {
    fs.writeFileSync(`${path}/auth.txt`, `${VPN_PROVIDER_USERNAME}\n${VPN_PROVIDER_PASSWORD}`);
  }

  static isEmpty(path: string) {
    return !fs.existsSync(path);
  }

  static getConfigs(path: string) {
    const files = fs.readdirSync(path);
    return files.map(f => `${path}/${f}`);
  }
}