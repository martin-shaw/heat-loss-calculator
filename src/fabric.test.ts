import { FabricComponent, calculateUValue, calculateUValueFromRValues, calculateRValue } from "./fabric";

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

const ecoWool: FabricComponent = {
    name: "eco-wool",
    thickness: 0.35,
    kValue: {
        type: "eco-wool",
        value: 0.0425,
    },
};

describe("u-value calibration", () => {
    test("u-value-calibration.png TIS-A9-UNDERSTANDING-K-VALUES.pdf", () => {
        // Calculation from https://www.ibstock.co.uk/design-and-technical-services/technical-information
        // https://assets.ctfassets.net/eta2vegx3yuv/19W8PzNYp7qcdny3iL7V7f/0543cadee6f6139e326d1be4b2794dd7/TIS-A9-UNDERSTANDING-K-VALUES.pdf
        const result = calculateUValueFromRValues([
            0.02,
            ...[outerLeaf, cavity, insulation, innerLeaf, plasterboard].map(calculateRValue),
            0.13,
        ]);

        expect(result.toFixed(2)).toBe("0.18");
    });

    test("eco wool insulation", () => {
        // This matches the manufacturers data
        const result = calculateUValue([ecoWool]);
        expect(result.toFixed(2)).toBe("0.12");
    });

    test("Single composition is calculated", () => {
        const result = calculateUValue([
            { name: "single brick", thickness: 0.1, kValue: { type: "brick", value: 0.1 } },
        ]);
        expect(result).toBe(1);
    });
});
