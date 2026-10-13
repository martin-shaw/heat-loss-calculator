import { calculate } from "./solid-floor-lookup";

describe("Table 6.C lookup", () => {
    test("interpolates just above a tabulated P/A", () => {
        // P/A = 0.11 sits between 0.10 → 0.22 and 0.15 → 0.30.
        const result = calculate({ area: 100, exposedPerimiter: 11 });
        expect(result).toBeCloseTo(0.236, 5);
    });

    test("extrapolates above the last tabulated P/A instead of capping at 0.70", () => {
        const result = calculate({ area: 10, exposedPerimiter: 8 });
        expect(result).toBeCloseTo(1, 5);
        expect(result).toBeGreaterThan(0.7);
    });

    test("returns the first row when P/A is below the table", () => {
        const result = calculate({ area: 100, exposedPerimiter: 1 });
        expect(result).toBe(0.13);
    });
});
