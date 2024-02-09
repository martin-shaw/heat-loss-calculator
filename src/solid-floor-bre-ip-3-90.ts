interface Model {
    area: number;
    exposedPerimiter: number;
}

// https://www.heat-engineer.com/pdf/HelpGuide.pdf
export const calculate = (model: Model) => {
    const { area, exposedPerimiter } = model;
    // This formula uses the external perimeter (external wall) and the floor area to calculate a U value.
    // U = 0.05 + (1.65(P/A)) – (0.6((P/A)²))
    // Where:
    // U = U-Value of the uninsulated floor (W/m²K).
    // P = Length of the exposed perimeter (m).
    // A = Area of the floor (m²)

    // U = 0.05 + (1.65(P/A)) – (0.6((P/A)²))
    return 0.05 + 1.65 * (exposedPerimiter / area) - 0.6 * Math.pow(exposedPerimiter / area, 2);
};
