import { calculate } from "./solid-floor";
import { calculate as breIp390Method } from "./solid-floor-bre-ip-3-90";
import { calculate as lookupMethod } from "./solid-floor-lookup";

const wallThickness = 0.22;
const rf = 0;

describe("solid floor calibration", () => {
    test("area: 10, perimter: 1", () => {
        const area = 10;
        const exposedPerimiter = 1;

        const result = calculate({
            wallThickness,
            area,
            exposedPerimiter,
            rf,
        });

        const breIp390Result = breIp390Method({
            area,
            exposedPerimiter,
        });

        const lookupResult = lookupMethod({
            area,
            exposedPerimiter,
        });

        expect(result.toFixed(2)).toBe("0.23");
        expect(breIp390Result.toFixed(2)).toBe("0.21");
        expect(lookupResult).toBe(0.22);
    });

    test("area: 10, perimter: 2", () => {
        const area = 10;
        const exposedPerimiter = 2;

        const result = calculate({
            wallThickness,
            area,
            exposedPerimiter,
            rf,
        });

        const breIp390Result = breIp390Method({
            area,
            exposedPerimiter,
        });

        const lookupResult = lookupMethod({
            area,
            exposedPerimiter,
        });

        expect(result.toFixed(2)).toBe("0.39");
        expect(breIp390Result.toFixed(2)).toBe("0.36");
        expect(lookupResult).toBe(0.37);
    });

    test("area: 10, perimter: 3", () => {
        const area = 10;
        const exposedPerimiter = 3;

        const result = calculate({
            wallThickness,
            area,
            exposedPerimiter,
            rf,
        });

        const breIp390Result = breIp390Method({
            area,
            exposedPerimiter,
        });

        const lookupResult = lookupMethod({
            area,
            exposedPerimiter,
        });

        expect(result.toFixed(2)).toBe("0.52");
        expect(breIp390Result.toFixed(2)).toBe("0.49");
        expect(lookupResult).toBe(0.49);
    });

    test("area: 10, perimter: 4", () => {
        const area = 10;
        const exposedPerimiter = 4;

        const result = calculate({
            wallThickness,
            area,
            exposedPerimiter,
            rf,
        });

        const breIp390Result = breIp390Method({
            area,
            exposedPerimiter,
        });

        const lookupResult = lookupMethod({
            area,
            exposedPerimiter,
        });

        expect(result.toFixed(2)).toBe("0.64");
        expect(breIp390Result.toFixed(2)).toBe("0.61");
        expect(lookupResult).toBe(0.6);
    });

    test("area: 10, perimter: 5", () => {
        const area = 10;
        const exposedPerimiter = 5;

        const result = calculate({
            wallThickness,
            area,
            exposedPerimiter,
            rf,
        });

        const breIp390Result = breIp390Method({
            area,
            exposedPerimiter,
        });

        const lookupResult = lookupMethod({
            area,
            exposedPerimiter,
        });

        expect(result.toFixed(2)).toBe("0.75");
        expect(breIp390Result.toFixed(2)).toBe("0.72");
        expect(lookupResult).toBe(0.7);
    });
});
