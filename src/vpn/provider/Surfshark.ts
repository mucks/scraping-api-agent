import { Provider } from './Provider';


export class Surfshark {
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