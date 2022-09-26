import { calculateSurfaceArea, calculateSurface } from "./calculator";

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

describe("calculateSurface", () => {
    test("surface is calculated", () => {
        const result = calculateSurface(
            {
                name: "external wall",
                width: 5,
                height: 2,
                boundaryTemperature: -3,
                composition: [{ name: "single brick", thickness: 0.1, kValue: { type: "brick", value: 0.1 } }],
                elements: [
                    { name: "window 1", width: 1, height: 1, composition: { name: "double glazing", uValue: 1 } },
                ],
            },
            20
        );

        expect(result).toEqual({ name: "external wall", area: 10, heatLoss: 230 });
    });
});
