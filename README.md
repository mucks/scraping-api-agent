# Scraping Api Agent

Agent for my Scraping Api that runs chromium behind a vpn in a docker container
and exposes Rest endpoints to use for scraping websites.

## Supported vpn Providers

* surfshark


## ROADMAP

* support purevpn, nordvpn etc
* add envs to filter vpn by country, city, provider
* add api route to shutdown server, so kubernetes or docker can restart it with new vpn