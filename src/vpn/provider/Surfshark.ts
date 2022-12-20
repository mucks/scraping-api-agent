import fs from 'fs';
import decompress from 'decompress'
import axios from 'axios';

const PATH = './openvpn/surfshark';

export class Surfshark {
  static async downloadConfigs() {
    fs.mkdirSync(PATH);
    const url = "https://my.surfshark.com/vpn/api/v1/server/configurations";
    const resp = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync('./tmp/surfshark.zip', resp.data);
    await decompress('./tmp/surfshark.zip', PATH);
    fs.unlinkSync("./tmp/surfshark.zip");
  }

  static addAuthTxtPathToConfigs() {
    const files = fs.readdirSync(PATH);
    files.forEach(file => {
      if (file.endsWith('.ovpn')) {
        const path = `${PATH}/${file}`;
        let data = fs.readFileSync(path, 'utf-8');
        data = data.replace('auth-user-pass', `auth-user-pass ${PATH}/auth.txt`);

        fs.writeFileSync(path, data);
      }
    });
  }

  static async createAuthTxtFromEnv() {
    const user = process.env.SURFSHARK_USER!;
    const password = process.env.SURFSHARK_PASSWORD!;
    fs.writeFileSync(`${PATH}/auth.txt`, `${user}\n${password}`);
  }

  static async init() {
    if (!fs.existsSync(PATH)) {
      await this.downloadConfigs();
      this.addAuthTxtPathToConfigs();
    }
    this.createAuthTxtFromEnv();
  }
  static getConfigs() {
    const files = fs.readdirSync(PATH);
    return files.map(f => `${PATH}/${f}`);
  }
}