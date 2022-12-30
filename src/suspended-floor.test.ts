import { calculate } from "./suspended-floor";

/**
 * // https://www.sciencedirect.com/science/article/pii/S0378778817311350
 * The case study house was a pre-1919 solid wall terraced house located in a conservation area in London and the case study characteristics,
 * alongside instrumentation of the uninsulated floor and research methods, are described in more detail in [38].
 * The 12.15 m2 living room floor had a floor void depth of 250 mm below the 100 mm joists, with a 150 mm concrete oversite surface on the soil.
 */

// RdSAP value
const wallThickness = 0.22;
// Area is in the article. See comment abvoe
const area = 12.15;
// Exposed perimiter has been estimated from the floorplan diagrams.
const exposedPerimiter = 3;
// Height above ground is in the article (0.25 void below 0.1 joists)
const heightAboveGround = 0.35;

describe("Science Direct case study RdSAP calibration", () => {
    test("Uninsulated floor", () => {
        const result = calculate(wallThickness, area, exposedPerimiter, heightAboveGround);
        // Science direct RdSAP value is 0.51
        expect(result.toFixed(2)).toBe("0.47");
    });

    test("Woodfibre insulated floor 100mm Pavaflex", () => {
        // thickness / thermal conductivity
        const thermalResistance = 0.1 / 0.038;

        // Using the same height above ground as uninsulated floor. Maybe should use 0.25 for the 100mm insulated floor
        const result = calculate(wallThickness, area, exposedPerimiter, heightAboveGround, thermalResistance);
        // Science direct RdSAP value is 0.22
        expect(result.toFixed(2)).toBe("0.17");
    });
});
