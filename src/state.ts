
class State {
  private _isBusy: boolean = false

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