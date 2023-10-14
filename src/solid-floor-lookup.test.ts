import { calculate, maxUValue } from "./solid-floor-lookup";

describe("calculate", () => {
    test("lookup", () => {
        const result = calculate({
            area: 12,
            exposedPerimiter: 7,
        });
        expect(result).toBe(maxUValue);
    });
});
