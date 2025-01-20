export declare class NetworkInfo {
    _network_id: number;
    _protocol_magic: number;
    constructor(network_id: number, protocol_magic: number);
    network_id(): number;
    protcol_magic(): number;
    static testnet_preview(): NetworkInfo;
    static testnet_preprod(): NetworkInfo;
    static mainnet(): NetworkInfo;
}
