import { room as bedroom3 } from "./bedroom-three";
import { flatCeilingArea, gableEndArea, kneeWallArea, slopingCeilingArea } from "./room-in-roof";

describe("room-in-roof areas", () => {
    test("a 45° roof with no flat ceiling splits slope and gable", () => {
        const geometry = {
            length: 2,
            span: 2,
            kneeWallHeight: 0,
            pitchDegrees: 45,
            flatCeilingWidth: 0,
        };

        expect(flatCeilingArea(geometry)).toBe(0);
        expect(kneeWallArea(geometry)).toBe(0);
        expect(slopingCeilingArea(geometry)).toBeCloseTo(4 * Math.SQRT2, 5);
        expect(gableEndArea(geometry)).toBeCloseTo(1, 5);
    });

    test("flat ceiling, slopes, knee walls, and gable ends are separate areas", () => {
        const geometry = {
            length: 4,
            span: 6,
            kneeWallHeight: 1,
            pitchDegrees: 30,
            flatCeilingWidth: 2,
        };

        expect(flatCeilingArea(geometry)).toBe(8);
        expect(kneeWallArea(geometry)).toBe(8);
        expect(slopingCeilingArea(geometry)).toBeCloseTo(18.4752, 3);
        expect(gableEndArea(geometry)).toBeCloseTo(10.6188, 3);
    });

    test("Bedroom 3 still uses its plan roof area", () => {
        const roof = bedroom3.surfaces.find((surface) => surface.name === "roof");
        const planArea = 4.9 * 3.7;
        const rafterArea = slopingCeilingArea({
            length: 4.9,
            span: 3.7,
            kneeWallHeight: 1.2,
            pitchDegrees: 30,
            flatCeilingWidth: 0,
        });

        expect(roof && roof.width * roof.height).toBeCloseTo(planArea, 5);
        expect(rafterArea).toBeGreaterThan(planArea);
    });
});
