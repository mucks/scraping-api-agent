import { Request, Response } from 'express';
import fs from 'fs';

export const createDirs = () => {
  if (!fs.existsSync("./openvpn")) {
    fs.mkdirSync("./openvpn")
  }
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp")
  }
}

export const urlCheck = (req: Request, res: Response): string => {
  try {
    const url = req.body.url;
    return url;
  } catch (e) {
    console.log(e);
    res.status(401).send('Missing url');
  }
};