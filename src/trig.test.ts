import { hypotenuse } from "./trig";

describe("hypotenuse", () => {
    test("hypotenuse is calcuated", () => {
        const result = hypotenuse(1000, 30);
        expect(result).toBeCloseTo(2000, 5);
    });

    test("a non-integer hypotenuse is not truncated", () => {
        expect(hypotenuse(1.6, 30)).toBeCloseTo(3.2, 5);
    });
});
