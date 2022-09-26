import { sum } from "./math";

describe("sum", () => {
    test("values are summed", () => {
        const result = sum([1, 2, 3, 4]);
        expect(result).toBe(10);
    });
});
