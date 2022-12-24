import { rmSync } from "fs";
import { Surfshark } from "./Surfshark";

jest.setTimeout(30000);
test('Surfshark config download and extraction', async () => {
  const path = './tmp/openvpn/surfshark';
  await Surfshark.init(path);

  rmSync(path, { recursive: true });
});