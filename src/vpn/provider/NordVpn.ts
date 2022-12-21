import { Provider } from './Provider';
import fs from 'fs';

const PATH = './openvpn/nordvpn';

export class NordVpn {
  private static async downloadConfigs() {
    const url = "https://downloads.nordcdn.com/configs/archives/servers/ovpn.zip";
    await Provider.downloadConfigs(PATH, url);
  }

  private static moveFiles() {
    const tcpPath = `${PATH}/ovpn_tcp`;
    const udpPath = `${PATH}/ovpn_udp`;

    Provider.moveAllOvpnFiles(tcpPath, PATH);
    Provider.moveAllOvpnFiles(udpPath, PATH);

    fs.rmSync(tcpPath, { recursive: true });
    fs.rmSync(udpPath, { recursive: true });
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