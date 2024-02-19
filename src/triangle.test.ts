import { area } from "./triangle";

describe("area", () => {
    test("rects are summed", () => {
        const result = area(1.5, 30);
        expect(result.toFixed(2)).toBe("1.95");
    });
});
