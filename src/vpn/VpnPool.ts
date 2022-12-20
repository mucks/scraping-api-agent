import { Surfshark } from "./provider/Surfshark";

export class VpnPool {
  static async init() {
    await Surfshark.init();
  }

  static get_random_vpn() {
    const configs = Surfshark.getConfigs();
    const random = Math.floor(Math.random() * configs.length);
    return configs[random];
  }
}