export interface kValue {
    type: string;
    value: number;
}

export const brick: kValue = { type: "brick", value: 0.71 };
export const plaster: kValue = { type: "plaster", value: 0.16 };
export const pir: kValue = { type: "pir", value: 0.022 };
export const mineralWool: kValue = { type: "mineral-wool", value: 0.032 };
// value from the manufacturer
export const ecoWool: kValue = { type: "eco-wool", value: 0.0425 };
