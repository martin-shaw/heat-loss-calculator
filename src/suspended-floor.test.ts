import { calculate } from "./suspended-floor";

// https://www.sciencedirect.com/science/article/pii/S0378778817311350
describe("Science Direct case study RdSAP calibration", () => {
    test("uninsulated floor", () => {
        const result = calculate(0.22, 12.5, 3.5, 0.25);
        expect(result.toFixed(2)).toBe("0.51");
    });
});
