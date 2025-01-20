export class NetworkInfo {
    _network_id;
    _protocol_magic;
    constructor(network_id, protocol_magic) {
        this._network_id = network_id;
        this._protocol_magic = protocol_magic;
    }
    network_id() {
        return this._network_id;
    }
    protcol_magic() {
        return this._protocol_magic;
    }
    static testnet_preview() {
        return new NetworkInfo(0b0000, 2);
    }
    static testnet_preprod() {
        return new NetworkInfo(0b0000, 1);
    }
    static mainnet() {
        return new NetworkInfo(0b0001, 764824073);
    }
}
