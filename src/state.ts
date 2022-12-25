import { Response } from "express";
import { Browser, chromium } from "playwright-chromium";
import { PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } from "./config";

class State {
  private _isBusy: boolean = false
  private _browser?: Browser;

  public async createBrowser() {
    this._browser = await chromium.launch({ executablePath: PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
  };

  public closeBrowser() {
    this._browser?.close();
    this._browser = undefined;
  }

  public browser(): Browser {
    return this._browser!;
  }

  public isBusy(): boolean {
    return this._isBusy;
  }
  public setBusy() {
    this._isBusy = true;
  }
  public setNotBusy() {
    this._isBusy = false;
  }
}

export const state = new State();

export const busyCheck = (res: Response) => {
  if (state.isBusy()) {
    res.status(500).send('Server is busy');
    return;
  }
};