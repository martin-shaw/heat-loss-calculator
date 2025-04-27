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
            gables: [{ roofAngle: 45, roofBase: 0 }],
            composition: [],
        });
        expect(result).toBe(6);
    });
});

// TODO: Add tests for surface heatloss
// separate heat loss calculation from surfaces calculation to make it easier to have other models
// SAP vs CIBSE
// external vs unheated spaces
// non-rectangular shapes, for example dormer cheeks, surface could be changed to extend shape?
// shape has an area. Surface could be a rect or a shape
// check kvalue understanding. Should be able to calculate and equal a uvalue equivalent
