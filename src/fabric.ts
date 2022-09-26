import { brick, plaster as plasterKvalue, kValue } from "./k-value";

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
export const doubleGlazing: Fabric = { name: "double glazing", uValue: 1.6 };
export const internalFloor: Fabric = { name: "internal floor", uValue: 1.7 };
export const internalCeiling: Fabric = { name: "internal celing", uValue: 1.7 };
