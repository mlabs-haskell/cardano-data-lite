import { BigNum, DataCost, TransactionOutput } from "../generated";
/**
 * Calculates the minimal amount of ada for the output for case when the amount is included to the output
 *
 *
 * @param output - The transaction output for which to calculate the minimum ADA.
 * @param data_cost - The data cost parameters, including coins per byte.
 * @returns The minimum ADA required as a `BigNum`.
 */
export declare function min_ada_for_output(output: TransactionOutput, data_cost: DataCost): BigNum;
