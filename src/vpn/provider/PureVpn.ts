import { Provider } from './Provider';
import fs from 'fs';

const PATH = './openvpn/purevpn';

export class PureVpn {
  private static async downloadConfigs() {
    const url = "https://d32d3g1fvkpl8y.cloudfront.net/heartbleed/windows/New+OVPN+Files.zip";
    await Provider.downloadConfigs(PATH, url);
  }

  private static moveFiles() {
    const zipName = "New+OVPN+Files";
    const tcpPath = `${PATH}/${zipName}/TCP`;
    const udpPath = `${PATH}/${zipName}/UDP`;

    Provider.moveAllOvpnFiles(tcpPath, PATH);
    Provider.moveAllOvpnFiles(udpPath, PATH);

    fs.rmSync(`${PATH}/${zipName}`, { recursive: true });
  }


  static async init() {
    if (Provider.isEmpty(PATH)) {
      await this.downloadConfigs();
      this.moveFiles();
      Provider.addAuthTxtPathToConfigs(PATH);
    }
    Provider.createAuthTxtFromEnv(PATH);
  }

  static getConfigs() {
    return Provider.getConfigs(PATH);
  }
}