import { spawn } from "child_process"

export class OpenVpn {
  static async connect(vpn: string): Promise<void> {
    const complete = "Initialization Sequence Completed";
    const openvpn = spawn("sudo", ["openvpn", vpn]);

    return new Promise((resolve, reject) => {
      openvpn.stdout.on('data', (data) => {
        const s = data.toString();
        console.log(s);
        if (s.includes(complete)) {
          resolve();
        }
      });
      openvpn.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      openvpn.on('error', (error) => {
        console.log(`error: ${error.message}`);
        process.exit(16);
      });

      openvpn.on("close", code => {
        console.log(`child process exited with code ${code}`);
        process.exit(16);
      });
    })
  }
}
