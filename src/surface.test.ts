import { FabricComponent } from "./fabric";
import { calculateUValue } from "./surface";

// Calculation from https://www.ibstockbrick.co.uk/wp-content/uploads/2021/06/TIS-A9-UNDERSTANDING-K-VALUES-AND-U-VALUES-2021.pdf
const outerLeaf: FabricComponent = {
    name: "outerLeaf",
    thickness: 0.102,
    kValue: {
        type: "brick",
        value: 0.6,
    },
};

const cavity: FabricComponent = {
    name: "cavity",
    thickness: 0.005,
    kValue: {
        type: "air",
        value: 0.046,
    },
};

const insulation: FabricComponent = {
    name: "insulation",
    thickness: 0.095,
    kValue: {
        type: "insulation",
        value: 0.021,
    },
};

const innerLeaf: FabricComponent = {
    name: "innerLeaf",
    thickness: 0.1,
    kValue: {
        type: "aerated block",
        value: 0.19,
    },
};

const plasterboard: FabricComponent = {
    name: "plasterboard",
    thickness: 0.013,
    kValue: {
        type: "plasterboard",
        value: 0.16,
    },
};

describe("calculateUValue", () => {
    test("Multiple compositions are calculated", () => {
        const result = calculateUValue([outerLeaf, cavity, insulation, innerLeaf, plasterboard]);
        expect(result.toFixed(2)).toBe("0.18");
    });

    test("Single composition is calculated", () => {
        const result = calculateUValue([
            { name: "single brick", thickness: 0.1, kValue: { type: "brick", value: 0.1 } },
        ]);
        expect(result).toBe(1);
    });
});
