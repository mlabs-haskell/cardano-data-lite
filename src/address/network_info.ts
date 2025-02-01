export class NetworkInfo {
  _network_id: number;
  _protocol_magic: number;

  constructor(network_id: number, protocol_magic: number) {
    this._network_id = network_id;
    this._protocol_magic = protocol_magic;
  }

  network_id(): number {
    return this._network_id;
  }

  protocol_magic(): number {
    return this._protocol_magic;
  }

  static testnet_preview(): NetworkInfo {
    return new NetworkInfo(0b0000, 2);
  }

  static testnet_preprod(): NetworkInfo {
    return new NetworkInfo(0b0000, 1);
  }

  static mainnet(): NetworkInfo {
    return new NetworkInfo(0b0001, 764824073);
  }
}
