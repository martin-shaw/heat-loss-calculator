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

// RdSAP Table S14: double glazing installed before 2002 (England & Wales), 12 mm gap, PVC frame.
// Neighbouring cells (6 mm 3.1, 16 mm 2.6, 2002-or-later 2.0) are not used by the sample rooms.
export const RdSAPPre2002DoubleGlazing12mmPvc: Fabric = {
    name: "double glazing, pre-2002, 12 mm, PVC",
    uValue: 2.8,
};

// Not an RdSAP table cell. Table S12 exposed upper floors are 1.20 (age bands A–G, as built) or 0.50 insulated.
// These sample surfaces are between rooms at the same temperature, so the value does not affect heat loss.
export const internalFloor: Fabric = { name: "internal floor", uValue: 1.7 };
export const internalCeiling: Fabric = { name: "internal celing", uValue: 1.7 };

// RdSAP Table S6: Wall U-values – England and Wales
// Solid brick as built, age bands A–E. The pre-9.93 figure was 2.1.
// Age band F is 1.0, and later bands are lower. Those cells are not encoded here.
export const RdSAPDoubleBrick: Fabric = { name: "double brick", uValue: 1.7 };

// RdSAP Table S8B: solid masonry, timber frame, or system built.
// Unfilled cavity is 0.5, filled cavity is 0.2, unknown house is 0.25. The sample rooms are solid masonry.
export const RdSAPPartyWallSolidMasonry: Fabric = { name: "party wall, solid masonry", uValue: 0 };

export const calculateUValue = (fabrics: FabricComponent[]) => calculateUValueFromRValues(fabrics.map(calculateRValue));

export const calculateUValueFromRValues = (rValues: number[]) => 1 / sum(rValues);

export const calculateRValue = (fabric: FabricComponent) => fabric.thickness / fabric.kValue.value;
