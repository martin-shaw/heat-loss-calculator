import { sum } from "./rect";

describe("sum", () => {
    test("rects are summed", () => {
        const result = sum([
            { width: 1, height: 2 },
            { width: 0.5, height: 0.8 },
        ]);
        expect(result).toBe(2.4);
    });
});
