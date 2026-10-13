import { calculate } from "./suspended-floor";

// Calibration case study — see docs/MODELS.md#suspended-floor-u-value
const wallThickness = 0.22;
const area = 27.7;
const exposedPerimiter = 9.1;
const heightAboveGround = 0.25; // Void depth below bottom of joist
const rf = 0.13;
const ventilation = 0.0024;
const wallUValue = 1.7;

describe("Science Direct case study RdSAP calibration", () => {
    test("Uninsulated floor", () => {
        // S5.5 U-values of floors next to the ground, RdSAP 2012 9.93.
        // On this plan, the RdSAP defaults (Rf = 0.2, Uw = 1.5, h = 0.3, ε = 0.003)
        // give 0.59. The Pelsmakers paper quotes 0.51 (RdSAP) and 0.57 (ISO 13370)
        // for its own assumptions; those figures are background, not this assertion.

        const result = calculate({
            wallThickness,
            area,
            exposedPerimiter,
            heightAboveGround,
            rf,
            wallUValue,
            ventilation,
        });
        expect(result.toFixed(2)).toBe("0.60");
    });

    test("Woodfibre insulated floor 100mm Pavaflex", () => {
        // thickness / thermal conductivity
        const insulationThermalResistance = 0.1 / 0.038;

        const result = calculate({
            wallThickness,
            area,
            exposedPerimiter,
            heightAboveGround,
            rf,
            wallUValue,
            ventilation,
            insulationThermalResistance,
        });
        expect(result.toFixed(2)).toBe("0.23");
    });

    test("Bead insulated floor Warmfill Silver beads", () => {
        // 0.25 void depth below bottom of joist
        // 0.35 void depth + jost depth (referenced 3.1. Intervention 1)
        // thickness / thermal conductivity
        const insulationThermalResistance = 0.25 / 0.033;

        const result = calculate({
            wallThickness,
            area,
            exposedPerimiter,
            heightAboveGround: 0,
            rf,
            wallUValue,
            ventilation,
            insulationThermalResistance,
        });
        expect(result.toFixed(2)).toBe("0.11");
    });

    test("uses the dg >= B ground formula for a very small floor", () => {
        // dg = 0.615, B = 0.25, so the ISO 13370 linear branch applies.
        // Ux is zero so the ground formula is visible in U.
        const result = calculate({
            wallThickness: 0.3,
            area: 0.5,
            exposedPerimiter: 4,
            heightAboveGround: 0,
            rf: 0.2,
            ventilation: 0,
            wallUValue: 1.5,
        });

        expect(result.toFixed(2)).toBe("0.97");
    });
});
