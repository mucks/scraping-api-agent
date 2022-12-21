import { Provider } from './Provider';

const PATH = './openvpn/surfshark';

export class Surfshark {
  static async downloadConfigs() {
    const url = "https://my.surfshark.com/vpn/api/v1/server/configurations";
    await Provider.downloadConfigs(PATH, url);
  }

  static async init() {
    if (Provider.isEmpty(PATH)) {
      await this.downloadConfigs();
      Provider.addAuthTxtPathToConfigs(PATH);
    }
    Provider.createAuthTxtFromEnv(PATH);
  }

  static getConfigs() {
    return Provider.getConfigs(PATH);
  }
}