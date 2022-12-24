import fs from 'fs';
import axios from 'axios';
import decompress from 'decompress'
import { VPN_PROVIDER, VPN_PROVIDER_PASSWORD, VPN_PROVIDER_USERNAME } from '../../config';
import { Surfshark } from './Surfshark';
import { PureVpn } from './PureVpn';
import { NordVpn } from './NordVpn';


export class Provider {
  configs: string[] = [];
  async init() {
    switch (VPN_PROVIDER) {
      case 'surfshark':
        await Surfshark.init('./openvpn/surfshark');
        this.configs = Surfshark.getConfigs('./openvpn/surfshark');
        break;
      case 'purevpn':
        await PureVpn.init('./openvpn/purevpn');
        this.configs = PureVpn.getConfigs('./openvpn/purevpn');
        break;
      case 'nordvpn':
        await NordVpn.init('./openvpn/nordvpn');
        this.configs = NordVpn.getConfigs('./openvpn/nordvpn');
        break;
    }
  }

  get_random_vpn() {
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