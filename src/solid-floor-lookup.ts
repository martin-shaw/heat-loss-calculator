/**
 * Solid floor U-value from P/A lookup (gov.scot Table 6.C).
 * Model: docs/MODELS.md#solid-floor-u-value-lookup
 *
 * Values between tabulated P/A ratios are linearly interpolated.
 * Below the first key, the first row is returned.
 * Above the last key, the last segment is extrapolated so U is not held at 0.70.
 */
interface Model {
    area: number;
    exposedPerimiter: number;
}

const bands: Array<[number, number]> = [
    [0.05, 0.13],
    [0.1, 0.22],
    [0.15, 0.3],
    [0.2, 0.37],
    [0.25, 0.44],
    [0.3, 0.49],
    [0.35, 0.55],
    [0.4, 0.6],
    [0.45, 0.65],
    [0.5, 0.7],
];

const keyTolerance = 1e-9;

export const calculate = (model: Model) => {
    const { area, exposedPerimiter } = model;
    const perimeterToArea = exposedPerimiter / area;

    for (const [key, uValue] of bands) {
        if (Math.abs(perimeterToArea - key) < keyTolerance) {
            return uValue;
        }
    }

    if (perimeterToArea <= bands[0][0]) {
        return bands[0][1];
    }

    for (let index = 0; index < bands.length - 1; index++) {
        const [lowerRatio, lowerU] = bands[index];
        const [upperRatio, upperU] = bands[index + 1];

        if (perimeterToArea < upperRatio) {
            const fraction = (perimeterToArea - lowerRatio) / (upperRatio - lowerRatio);
            return lowerU + fraction * (upperU - lowerU);
        }
    }

    const [previousRatio, previousU] = bands[bands.length - 2];
    const [lastRatio, lastU] = bands[bands.length - 1];
    const slope = (lastU - previousU) / (lastRatio - previousRatio);
    return lastU + (perimeterToArea - lastRatio) * slope;
};
