import { BigNum, BigInt, ExUnitPrices, ExUnits, Transaction, UnitInterval } from "../generated";
export declare class LinearFee {
    private _constant;
    private _coefficient;
    constructor(coefficient: BigNum, constant: BigNum);
    static new(coefficient: BigNum, constant: BigNum): LinearFee;
    constant(): BigNum;
    coefficient(): BigNum;
}
export declare function min_fee(tx: Transaction, linearFee: LinearFee): BigNum;
export declare function calculate_exunits_ceil_cost(exUnits: ExUnits, exUnitPrices: ExUnitPrices): BigInt;
export declare function min_script_fee(tx: Transaction, exUnitPrices: ExUnitPrices): BigInt;
export declare function min_ref_script_fee(totalRefScriptsSize: number, refScriptBigNumsPerByte: UnitInterval): BigInt;
