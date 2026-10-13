/**
 * Fabric U-values: layered calculation from λ, and RdSAP table defaults.
 * Models: docs/MODELS.md#layered-u-value-from-k-values
 *         docs/MODELS.md#rdsap-fabric-defaults
 */
import { brick, plaster as plasterKvalue, kValue } from "./k-value";
import { sum } from "./math";

export interface Fabric {
    name: string;
    uValue: number;
}

export interface FabricComponent {
    name: string;
    thickness: number;
    kValue: kValue;
}

export const doubleBrick: FabricComponent = { name: "double brick", thickness: 0.2, kValue: brick };
export const singleBrick: FabricComponent = { name: "single brick", thickness: 0.1, kValue: brick };
export const plaster: FabricComponent = { name: "plaster", thickness: 0.02, kValue: plasterKvalue };

// RdSAP
// Table S14 : Window characteristics
// 12 mm glazing gap in PVC frame
export const doubleGlazing: Fabric = { name: "double glazing", uValue: 2.8 };
export const internalFloor: Fabric = { name: "internal floor", uValue: 1.7 };
export const internalCeiling: Fabric = { name: "internal celing", uValue: 1.7 };

// RdSAP Table S6: Wall U-values – England and Wales
// Solid brick as built, age bands A–E. The pre-9.93 figure was 2.1.
// Age band F is 1.0, and later bands are lower. Those cells are not encoded here.
export const RdSAPDoubleBrick: Fabric = { name: "double brick", uValue: 1.7 };

// Table S8B : U-values of party walls
export const RdSAPPartyWall: Fabric = { name: "party wall", uValue: 0 };

export const calculateUValue = (fabrics: FabricComponent[]) => calculateUValueFromRValues(fabrics.map(calculateRValue));

export const calculateUValueFromRValues = (rValues: number[]) => 1 / sum(rValues);

export const calculateRValue = (fabric: FabricComponent) => fabric.thickness / fabric.kValue.value;
