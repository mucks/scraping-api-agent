export type WireguardCredentials = {
  pubKey: string,
  privKey: string,
}

export type RegisterInfo = {
  expiresAt: Date;
  pubKey: string;
  name: string;
  id: string;
  createdAt: Date;
}


export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface Entry {
  value: string;
}

export interface Info {
  id: string;
  entry: Entry;
}

export interface SurfsharkConfig {
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  load: number;
  id: string;
  coordinates: Coordinates;
  info: Info[];
  type: string;
  location: string;
  connectionName: string;
  pubKey: string;
  tags: any[];
  transitCluster?: any;
  flagUrl: string;
}