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

/** ISO 6946 surface resistances (m²K/W) by heat-flow direction. */
export const iso6946SurfaceResistance = {
    internalHorizontal: 0.13,
    internalUpward: 0.1,
    internalDownward: 0.17,
    external: 0.04,
};

export interface SurfaceResistances {
    rsi: number;
    rse: number;
}

export const internalPartitionResistances: SurfaceResistances = {
    rsi: iso6946SurfaceResistance.internalHorizontal,
    rse: iso6946SurfaceResistance.internalHorizontal,
};

export const externalRoofResistances: SurfaceResistances = {
    rsi: iso6946SurfaceResistance.internalUpward,
    rse: iso6946SurfaceResistance.external,
};

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

/** Series resistance of plane layers, U = 1 / Σ(d/λ). Does not include Rsi or Rse. */
export const calculateUValue = (fabrics: FabricComponent[]) => calculateUValueFromRValues(fabrics.map(calculateRValue));

/** Element U-value. Rsi and Rse are required so a wall cannot omit surface resistances. */
export const calculateElementUValue = (fabrics: FabricComponent[], resistances: SurfaceResistances) =>
    calculateUValueFromRValues([resistances.rsi, ...fabrics.map(calculateRValue), resistances.rse]);

export const calculateUValueFromRValues = (rValues: number[]) => 1 / sum(rValues);

export const calculateRValue = (fabric: FabricComponent) => fabric.thickness / fabric.kValue.value;
