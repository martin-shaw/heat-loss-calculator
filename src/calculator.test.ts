import { room as bedroom1 } from "./bedroom-one";
import {
    calculateRoom,
    calculateSurfaceArea,
    calculateSurfaceAreas,
    calculateSurfaceHeatloss,
    calculateThermalBridgingHeatLoss,
    calculateVentilationHeatLoss,
} from "./calculator";
import { RdSAPDoubleBrick } from "./fabric";
import { calculate as solidFloorU } from "./solid-floor";

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
        expect(result).toBe(4);
    });

    test("gable area uses the wall width", () => {
        const narrow = calculateSurfaceArea({
            name: "wall",
            width: 2,
            height: 2.8,
            gables: [{ roofAngle: 30, roofBase: 1.2 }],
            composition: [],
        });
        const wide = calculateSurfaceArea({
            name: "wall",
            width: 3.7,
            height: 2.8,
            gables: [{ roofAngle: 30, roofBase: 1.2 }],
            composition: [],
        });

        expect(narrow).toBeCloseTo(2 * 2.8 - (2 * 1.6) / 2, 5);
        expect(wide).toBeCloseTo(3.7 * 2.8 - (3.7 * 1.6) / 2, 5);
        expect(wide).not.toBeCloseTo(narrow, 5);
    });
});

describe("calculateSurfaceHeatloss", () => {
    const wall = { name: "wall", composition: { name: "wall", uValue: 1 }, area: 1 };

    test("a boundary of 0°C is kept", () => {
        expect(calculateSurfaceHeatloss(wall, 20, 0)).toBe(20);
    });

    test("a boundary of -3°C is kept", () => {
        expect(calculateSurfaceHeatloss(wall, 18, -3)).toBe(21);
    });

    test("an omitted boundary is rejected", () => {
        expect(() => calculateSurfaceHeatloss(wall, 18)).toThrow(/boundaryTemperature/);
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

describe("slab floor inside a room", () => {
    test("heat loss is the slab U-value times the room floor area and ΔT", () => {
        const slabArea = 80;
        const exposedPerimiter = 36;
        const roomFloorArea = 20;
        const roomTemperature = 20;
        const outside = -3;
        const uValue = solidFloorU({
            wallThickness: 0.22,
            area: slabArea,
            exposedPerimiter,
            rf: 0,
        });

        const result = calculateRoom({
            name: "end room on a solid ground floor",
            temperature: roomTemperature,
            surfaces: [
                {
                    name: "solid ground floor",
                    width: 5,
                    height: 4,
                    composition: { name: "solid ground floor", uValue },
                    boundaryTemperature: outside,
                },
            ],
        });

        expect(result.surfaces[0].area).toBe(roomFloorArea);
        expect(result.heatLoss).toBeCloseTo(uValue * roomFloorArea * (roomTemperature - outside), 6);
    });
});

describe("ventilation and thermal bridging", () => {
    const deltaT = 21;
    const bedroom1Volume = 4.9 * 3.7 * 2.8;
    const bedroom1ExposedWall = 4.9 * 2.8;

    test("ventilation is 0.33 × n × V × ΔT and is not part of the fabric total", () => {
        expect(calculateVentilationHeatLoss(0.5, bedroom1Volume, deltaT)).toBeCloseTo(176, 0);
        expect(calculateRoom(bedroom1).heatLoss).toBeCloseTo(553, 0);
    });

    test("thermal bridging is y × exposed area × ΔT", () => {
        expect(calculateThermalBridgingHeatLoss(0.15, bedroom1ExposedWall, deltaT)).toBeCloseTo(43, 0);
    });
});

// TODO: Add tests for surface heatloss
// separate heat loss calculation from surfaces calculation to make it easier to have other models
// SAP vs CIBSE
// external vs unheated spaces
// non-rectangular shapes, for example dormer cheeks, surface could be changed to extend shape?
// shape has an area. Surface could be a rect or a shape
// check kvalue understanding. Should be able to calculate and equal a uvalue equivalent
