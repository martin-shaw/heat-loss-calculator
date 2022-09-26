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
// RdSAP
// Table S14 : Window characteristics
// 12 mm glazing gap in PVC frame
export const doubleGlazing: Fabric = { name: "double glazing", uValue: 2.8 };
export const internalFloor: Fabric = { name: "internal floor", uValue: 1.7 };
export const internalCeiling: Fabric = { name: "internal celing", uValue: 1.7 };

// RdSAP
// Table S1 : Age band
// A before 1900
// Table S3 : Wall thickness
// solid brick 220mm
// Table S6 : Wall U-values – England and Wales
// 1.7 was 2.1
export const RdSAPDoubleBrick: Fabric = { name: "double brick", uValue: 2.1 };

// Table S8B : U-values of party walls
export const RdSAPPartyWall: Fabric = { name: "party wall", uValue: 0 };
