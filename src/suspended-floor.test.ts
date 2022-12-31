import { calculate } from "./suspended-floor";

/**
 * // https://www.sciencedirect.com/science/article/pii/S0378778817311350
 * The case study house was a pre-1919 solid wall terraced house located in a conservation area in London and the case study characteristics,
 * alongside instrumentation of the uninsulated floor and research methods, are described in more detail in [38].
 * The 12.15 m2 living room floor had a floor void depth of 250 mm below the 100 mm joists, with a 150 mm concrete oversite surface on the soil.
 */

// RdSAP value
const wallThickness = 0.22;
// Area is in the article. See comment above
const area = 27.7;
// Exposed perimiter has been estimated from the floorplan diagrams.
const exposedPerimiter = 9.1;
// Height above ground is in the article (0.25 void below 0.1 joists)
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

        // Using the same height above ground as uninsulated floor. Maybe should use 0.25 for the 100mm insulated floor
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
