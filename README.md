# Scraping Api Agent

Agent for my Scraping Api that runs chromium behind a vpn in a docker container
and exposes Rest endpoints to use for scraping websites.

## Supported vpn Providers

* surfshark
* purevpn
* nordvpn


## ROADMAP

- [x] support purevpn, nordvpn etc
- [x] add api route to shutdown server, so kubernetes or docker can restart it with new vpn
- [x] add envs to filter vpn by country
- [ ] add envs to filter vpn by city
- [ ] fix wireguard support