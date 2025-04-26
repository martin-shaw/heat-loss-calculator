import { area } from "./triangle";

describe("area", () => {
    test("area is calcuated", () => {
        const result = area(2.0, 30);
        expect(result.toFixed(2)).toBe("3.46");
    });

    test("isosceles area is calcuated", () => {
        const result = area(2.0, 45);
        expect(result.toFixed(2)).toBe("2.00");
    });
});
