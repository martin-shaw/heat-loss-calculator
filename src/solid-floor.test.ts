import { calculate } from "./solid-floor";

const wallThickness = 0.22;
const rf = 0;

describe("RdSAP calibration", () => {
    test("Soild ground floor", () => {
        const result = calculate({
            wallThickness,
            area: 8,
            exposedPerimiter: 2,
            rf,
        });

        expect(result.toFixed(2)).toBe("0.46");
    });

    test("Soild ground floor 2", () => {
        const result = calculate({
            wallThickness,
            area: 10,
            exposedPerimiter: 1,
            rf,
        });

        expect(result.toFixed(2)).toBe("0.23");
    });

    test("Soild ground floor 3", () => {
        const result = calculate({
            wallThickness,
            area: 12,
            exposedPerimiter: 7,
            rf,
        });
        expect(result.toFixed(2)).toBe("0.84");
    });
});
