import { hypotenuse } from "./trig";

describe("hypotenuse", () => {
    test("rects are summed", () => {
        const result = hypotenuse(1530, 30);
        expect(result).toBe(3060);
    });
});
