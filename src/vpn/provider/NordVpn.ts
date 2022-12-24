import { Provider } from './Provider';
import fs from 'fs';

export class NordVpn {
  private static async downloadConfigs(path: string) {
    const url = "https://downloads.nordcdn.com/configs/archives/servers/ovpn.zip";
    await Provider.downloadConfigs(path, url);
  }

  private static moveFiles(path: string) {
    const tcpPath = `${path}/ovpn_tcp`;
    const udpPath = `${path}/ovpn_udp`;

    Provider.moveAllOvpnFiles(tcpPath, path);
    Provider.moveAllOvpnFiles(udpPath, path);

    fs.rmSync(tcpPath, { recursive: true });
    fs.rmSync(udpPath, { recursive: true });
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