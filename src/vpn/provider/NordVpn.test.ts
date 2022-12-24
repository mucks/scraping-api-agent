import { rmSync } from "fs";
import { NordVpn } from "./NordVpn";

jest.setTimeout(30000);
test('NordVpn config download and extraction', async () => {
  const path = './tmp/openvpn/nordvpn';
  await NordVpn.init(path);

  rmSync(path, { recursive: true });
});