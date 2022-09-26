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
});
