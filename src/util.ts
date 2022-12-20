import fs from 'fs';

export const createDirs = () => {
  if (!fs.existsSync("./openvpn")) {
    fs.mkdirSync("./openvpn")
  }
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp")
  }
}