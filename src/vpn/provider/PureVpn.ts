import { Provider } from './Provider';
import fs from 'fs';

export class PureVpn {
  private static async downloadConfigs(path: string) {
    const url = "https://d32d3g1fvkpl8y.cloudfront.net/heartbleed/windows/New+OVPN+Files.zip";
    await Provider.downloadConfigs(path, url);
  }

  private static moveFiles(path: string) {
    const zipName = "New+OVPN+Files";
    const tcpPath = `${path}/${zipName}/TCP`;
    const udpPath = `${path}/${zipName}/UDP`;

    Provider.moveAllOvpnFiles(tcpPath, path);
    Provider.moveAllOvpnFiles(udpPath, path);

    fs.rmSync(`${path}/${zipName}`, { recursive: true });
  }


  static async init(path: string) {
    if (Provider.isEmpty(path)) {
      await this.downloadConfigs(path);
      this.moveFiles(path);
      Provider.addAuthTxtPathToConfigs(path);
    }
    Provider.createAuthTxtFromEnv(path);
  }

  static getConfigs(path: string) {
    return Provider.getConfigs(path);
  }
}