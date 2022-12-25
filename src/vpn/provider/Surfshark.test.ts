import { rmSync } from "fs";
import { Surfshark } from "./Surfshark";

jest.setTimeout(30000);

const path = './tmp/wireguard/surfshark';

test('surfshark-login', async () => {
  const token = await Surfshark.login();
  expect(token).not.toBeNull();
});

test('surfshark-generate-wireguard', async () => {
  const credentials = Surfshark.generate_wireguard(path);
  expect(credentials.privKey).not.toBeNull();
  expect(credentials.pubKey).not.toBeNull();
});

test('surfshark-register-wireguard', async () => {
  const token = await Surfshark.login();
  const creds = Surfshark.generate_wireguard(path);
  const data = await Surfshark.registerWireguard(path, token, creds.pubKey);
  expect(data.expiresAt.getTime()).toBeGreaterThan(new Date().getTime());
});

test('surfshark-download-configs', async () => {
  const creds = Surfshark.generate_wireguard(path);
  await Surfshark.downloadWireguardConfigs(path, creds.privKey);
  rmSync(path, { recursive: true });
});

// test('Surfshark config download and extraction', async () => {
//   const path = './tmp/openvpn/surfshark';
//   await Surfshark.init(path);

//   rmSync(path, { recursive: true });
// });