/**
 * Solid floor U-value — BRE IP 3/90-style approximation.
 * Model: docs/MODELS.md#solid-floor-u-value-bre-ip-390-approximate
 *
 * U = 0.05 + 1.65(P/A) − 0.6(P/A)²
 * U = uninsulated floor U-value (W/m²K), P = exposed perimeter (m), A = area (m²)
 */
interface Model {
    area: number;
    exposedPerimiter: number;
}

export const calculate = (model: Model) => {
    const { area, exposedPerimiter } = model;
    return 0.05 + 1.65 * (exposedPerimiter / area) - 0.6 * Math.pow(exposedPerimiter / area, 2);
};
