import { hypotenuse } from "./trig";

describe("hypotenuse", () => {
    test("hypotenuse is calcuated", () => {
        const result = hypotenuse(1000, 30);
        expect(result).toBe(2000);
    });
});
