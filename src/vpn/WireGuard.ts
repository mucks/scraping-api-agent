import { exec } from "child_process";


const connect = async (vpn: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cmd = `sudo wg-quick up ${vpn}`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  })
};

export class WireGuard {
  static async connect(vpn: string): Promise<void> {
    await connect(vpn);
  }
}