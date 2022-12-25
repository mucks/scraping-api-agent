import { Request, Response } from 'express';
import fs from 'fs';
import dns from 'dns';

export const createDirs = () => {
  if (!fs.existsSync("./openvpn")) {
    fs.mkdirSync("./openvpn")
  }
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp")
  }
}

export const urlCheck = (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    return url;
  } catch (e) {
    console.log(e);
    res.status(401).send('Missing url');
  }
};

export const dnsLookup = (hostname: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    dns.lookup(hostname, { family: 4, all: false }, (err, address, family) => {
      if (err) reject(err);
      resolve(address);
    });
  });
};
