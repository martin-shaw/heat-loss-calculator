import { calculateSurfaceArea } from "./calculator";

describe("calculateSurfaceArea", () => {
    test("elements are subtracted", () => {
        const result = calculateSurfaceArea({
            name: "wall",
            width: 5,
            height: 2,
            elements: [
                { name: "window 1", width: 1, height: 2, composition: [] },
                { name: "window 2", width: 0.5, height: 2, composition: [] },
            ],
            composition: [],
        });
        expect(result).toBe(7);
    });

    test("gables are subtracted", () => {
        const result = calculateSurfaceArea({
            name: "wall",
            width: 4.0,
            height: 2.0,
            gables: [{ roofAngle: 45, roofBase: 0, roofApex: 2.0 }],
            composition: [],
        });
        expect(result).toBe(6);
    });
});

// TODO: Add tests for surface heatloss
