import { room as bedroom1 } from "./bedroom-one";
import { calculateRoom, calculateSurfaceArea, calculateSurfaceAreas, calculateSurfaceHeatloss } from "./calculator";
import { RdSAPDoubleBrick } from "./fabric";

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

describe("Bedroom 1 fabric heat loss", () => {
    test("solid brick age bands A–E use Table S6 U = 1.7", () => {
        expect(RdSAPDoubleBrick.uValue).toBe(1.7);

        const result = calculateRoom(bedroom1);
        const external = bedroom1.surfaces.find((surface) => surface.name === "external wall");
        const wallOnly = calculateSurfaceAreas(external!).find((surface) => surface.name === "external wall");

        expect(calculateSurfaceHeatloss(wallOnly!, bedroom1.temperature, external!.boundaryTemperature)).toBeCloseTo(393, 0);
        expect(result.heatLoss).toBeCloseTo(553, 0);
        expect(
            result.surfaces.filter((surface) => surface.name !== "external wall").every((surface) => surface.heatLoss === 0)
        ).toBe(true);
    });
});

// TODO: Add tests for surface heatloss
// separate heat loss calculation from surfaces calculation to make it easier to have other models
// SAP vs CIBSE
// external vs unheated spaces
// non-rectangular shapes, for example dormer cheeks, surface could be changed to extend shape?
// shape has an area. Surface could be a rect or a shape
// check kvalue understanding. Should be able to calculate and equal a uvalue equivalent
