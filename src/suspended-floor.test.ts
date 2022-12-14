import { calculate } from "./suspended-floor";

// See src/suspended-floor.test.md for model assumptions
const wallThickness = 0.22;
const area = 27.7;
const exposedPerimiter = 9.1;
const heightAboveGround = 0.25;
const rf = 0.13;
const ventilation = 0.0024;
const wallUValue = 1.7;

describe("Science Direct case study RdSAP calibration", () => {
    test("Uninsulated floor", () => {
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
