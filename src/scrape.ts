import axios from "axios";
import { Request, Response } from "express";
import { USER_AGENT } from "./config";
import { state } from "./state";

export default async (req: Request, res: Response) => {
  if (state.isBusy()) {
    res.status(500).send('Server is busy');
    return;
  }

  let url = '';
  try {
    url = req.body.url;
  } catch (e) {
    console.log(e);
    res.status(401).send('Missing url');
    return;
  }

  try {
    state.setBusy();
    console.log(url);
    const resp = await axios.get(url, { headers: { 'User-Agent': USER_AGENT } });
    state.setNotBusy();

    res.send(resp.data);
  } catch (e) {
    state.setNotBusy();

    res.status(500).send(e);
  }
}