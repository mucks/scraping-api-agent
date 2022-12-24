import { rmSync } from "fs";
import { PureVpn } from "./PureVpn";

jest.setTimeout(30000);
test('PureVpn config download and extraction', async () => {
  const path = './tmp/openvpn/purevpn';
  await PureVpn.init(path);

  rmSync(path, { recursive: true });
});