import { calculate } from "./solid-floor-bre-ip-3-90";

describe("calculate", () => {
    test("lookup", () => {
        const result = calculate({
            area: 12,
            exposedPerimiter: 7,
        });
        expect(result.toFixed(2)).toBe("0.81");
    });

    test("lookup 2", () => {
        const result = calculate({
            area: 10,
            exposedPerimiter: 5,
        });
        expect(result.toFixed(2)).toBe("0.72");
    });

    test("lookup 3", () => {
        const result = calculate({
            area: 8,
            exposedPerimiter: 2,
        });
        expect(result.toFixed(2)).toBe("0.42");
    });

    test("lookup 4", () => {
        const result = calculate({
            area: 10,
            exposedPerimiter: 1,
        });
        expect(result.toFixed(2)).toBe("0.21");
    });
});
