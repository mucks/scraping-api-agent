import axios from "axios";
import { Request, Response } from "express";
import { USER_AGENT } from "./config";
import { busyCheck, state } from "./state";
import { urlCheck } from "./util";


export const scrape = async (url: string) => {
  const headers = {
    'User-Agent': USER_AGENT,
    'Accept-Encoding': 'html'
  };
  const resp = await axios.get(url, { headers });
  return resp.data;
};

export const apiScrape = async (req: Request, res: Response) => {
  busyCheck(res);

  const url = urlCheck(req, res);

  try {
    state.setBusy();

    const data = await scrape(url);

    state.setNotBusy();

    res.send(data);
  } catch (e) {
    state.setNotBusy();

    res.status(500).send(e);
  }
}