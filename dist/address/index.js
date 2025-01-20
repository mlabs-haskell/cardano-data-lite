import { ByronAddress } from "./byron.js";
import { MalformedAddress } from "./malformed.js";
import { EnterpriseAddress } from "./enterprise.js";
import { BaseAddress } from "./base.js";
import { RewardAddress } from "./reward.js";
import { bech32 } from "bech32";
export * from "./byron.js";
export * from "./malformed.js";
export * from "./enterprise.js";
export * from "./base.js";
export * from "./credential.js";
export * from "./network_info.js";
export * from "./reward.js";
export var AddressKind;
(function (AddressKind) {
    AddressKind[AddressKind["Base"] = 0] = "Base";
    AddressKind[AddressKind["Enterprise"] = 1] = "Enterprise";
    AddressKind[AddressKind["Reward"] = 2] = "Reward";
    AddressKind[AddressKind["Byron"] = 3] = "Byron";
    AddressKind[AddressKind["Malformed"] = 4] = "Malformed";
})(AddressKind || (AddressKind = {}));
export class Address {
    _variant;
    constructor(variant) {
        this._variant = variant;
    }
    free() { }
    kind() {
        return this._variant.kind;
    }
    payment_cred() {
        switch (this._variant.kind) {
            case AddressKind.Base:
                return this._variant.value.payment_cred();
            case AddressKind.Enterprise:
                return this._variant.value.payment_cred();
            case AddressKind.Reward:
                return this._variant.value.payment_cred();
            case AddressKind.Byron:
                return undefined;
            case AddressKind.Malformed:
                return undefined;
        }
    }
    is_malformed() {
        return this._variant.kind === AddressKind.Malformed;
    }
    network_id() {
        switch (this._variant.kind) {
            case AddressKind.Base:
                return this._variant.value.network_id();
            case AddressKind.Enterprise:
                return this._variant.value.network_id();
            case AddressKind.Reward:
                return this._variant.value.network_id();
            case AddressKind.Byron:
                return this._variant.value.network_id();
            case AddressKind.Malformed:
                throw new Error("Malformed address");
        }
    }
    to_bytes() {
        switch (this._variant.kind) {
            case AddressKind.Base:
                return this._variant.value.to_bytes();
            case AddressKind.Enterprise:
                return this._variant.value.to_bytes();
            case AddressKind.Reward:
                return this._variant.value.to_bytes();
            case AddressKind.Byron:
                return this._variant.value.to_bytes();
            case AddressKind.Malformed:
                return this._variant.value.original_bytes();
        }
    }
    static from_bytes(bytes, path) {
        if (bytes.length < 1) {
            return new Address({
                kind: AddressKind.Malformed,
                value: new MalformedAddress(bytes),
            });
        }
        const header = bytes[0];
        switch (header >> 4) {
            case 0b0000:
            case 0b0001:
            case 0b0010:
            case 0b0011:
                return new Address({
                    kind: AddressKind.Base,
                    value: BaseAddress.from_bytes(bytes)
                });
            case 0b0110:
            case 0b0111:
                return new Address({
                    kind: AddressKind.Enterprise,
                    value: EnterpriseAddress.from_bytes(bytes),
                });
            case 0b1110:
            case 0b1111:
                return new Address({
                    kind: AddressKind.Reward,
                    value: RewardAddress.from_bytes(bytes),
                });
            case 0b1000:
                return new Address({
                    kind: AddressKind.Byron,
                    value: ByronAddress.from_bytes(bytes, path),
                });
            default:
                return new Address({
                    kind: AddressKind.Malformed,
                    value: new MalformedAddress(bytes),
                });
        }
    }
    to_bech32(prefix_str) {
        let prefix = "";
        if (prefix_str) {
            prefix = prefix_str;
        }
        else {
            let prefix_header = "addr";
            if (this._variant.kind == AddressKind.Reward) {
                prefix_header = "stake";
            }
            let prefix_tail = "";
            if (this._variant.kind == AddressKind.Malformed) {
                prefix_tail = "_malformed";
            }
            else if (this.network_id() != 0) {
                prefix_tail = "_test";
            }
            prefix = prefix_header + prefix_tail;
        }
        return bech32.encode(prefix, bech32.toWords(this.to_bytes()), Number.MAX_SAFE_INTEGER);
    }
    static from_bech32(bech_str) {
        let decoded = bech32.decode(bech_str, Number.MAX_SAFE_INTEGER);
        let words = decoded.words;
        let bytesArray = bech32.fromWords(words);
        let bytes = new Uint8Array(bytesArray);
        return Address.from_bytes(bytes, []);
    }
    serialize(writer) {
        writer.writeBytes(this.to_bytes());
    }
    static deserialize(reader, path) {
        return Address.from_bytes(reader.readBytes(path), path);
    }
}
