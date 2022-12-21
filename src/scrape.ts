import axios from "axios";
import { Request, Response } from "express";
import { USER_AGENT } from "./config";

export default async (req: Request, res: Response) => {
  let url = '';
  try {
    url = req.body.url;
  } catch (e) {
    console.log(e);
    res.status(401).send('Missing url');
    return;
  }

  try {
    console.log(url);
    const resp = await axios.get(url, { headers: { 'User-Agent': USER_AGENT } });
    res.send(resp.data);
  } catch (e) {
    res.status(500).send(e);
  }
}