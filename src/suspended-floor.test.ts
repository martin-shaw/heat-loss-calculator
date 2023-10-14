import { calculate } from "./suspended-floor";

// See src/suspended-floor.test.md for model assumptions
const wallThickness = 0.22;
const area = 27.7;
const exposedPerimiter = 9.1;
const heightAboveGround = 0.25; // Void depth below bottom of joist
const rf = 0.13;
const ventilation = 0.0024;
const wallUValue = 1.7;

describe("Science Direct case study RdSAP calibration", () => {
    test("Uninsulated floor", () => {
        // S5.5 U-values of floors next to the ground RdSAP 2012 version 9.94 (20th September 2019)
        // rf = 0.2
        // wallUValue = 1.5
        // heightAboveGround = 0.3
        // ventilation =  0.003
        // Produces value of 0.57

        // rf = 0.2
        // wallUValue = 1.5
        // heightAboveGround = 0.17
        // Produces value of 0.51

        const result = calculate({
            wallThickness,
            area,
            exposedPerimiter,
            heightAboveGround,
            rf,
            wallUValue,
            ventilation,
        });
        // Science direct RdSAP value is 0.51
        // Science direct ISO-13370 value is 0.57
        expect(result.toFixed(2)).toBe("0.57");
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
        // Science direct RdSAP value is 0.22
        expect(result.toFixed(2)).toBe("0.21");
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
        expect(result.toFixed(2)).toBe("0.08");
    });
});
