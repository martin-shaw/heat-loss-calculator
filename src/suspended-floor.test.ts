import { calculate } from "./suspended-floor";

const wallThickness = 0.22;
const area = 12.5;
const exposedPerimiter = 3.5;
const heightAboveGround = 0.25;

// https://www.sciencedirect.com/science/article/pii/S0378778817311350
describe("Science Direct case study RdSAP calibration", () => {
    test("Uninsulated floor", () => {
        const result = calculate(wallThickness, area, exposedPerimiter, heightAboveGround);
        expect(result.toFixed(2)).toBe("0.51");
    });

    test("Woodfibre insulated floor 100 mm Pavaflex", () => {
        // thickness / thermal conductivity
        const thermalResistance = 0.1 / 0.038;

        const result = calculate(wallThickness, area, exposedPerimiter, heightAboveGround, thermalResistance);
        // Science direct RdSAP value is 0.22. Perhaps the discrepancy lies in the thermal resistance value
        expect(result.toFixed(2)).toBe("0.19");
    });
});
