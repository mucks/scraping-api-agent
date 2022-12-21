require('dotenv').config();

export const USE_VPN = process.env.USE_VPN;
export const PRODUCTION = process.env.PRODUCTION == 'true';
export const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
export const VPN_PROVIDER_USERNAME = process.env.VPN_PROVIDER_USERNAME!;
export const VPN_PROVIDER_PASSWORD = process.env.VPN_PROVIDER_PASSWORD!;
export const VPN_PROVIDER = process.env.VPN_PROVIDER!;
export const PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH 