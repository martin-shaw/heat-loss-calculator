/**
 * Right-triangle area helper (utility, not a thermal model).
 * See: docs/MODELS.md (Surface geometry)
 * https://www.omnicalculator.com/math/right-triangle-area
 *
 * Symmetric gable area is (wall width × rise) / 2 and is calculated in calculator.ts.
 */
import { hypotenuse } from "./trig";

export const area = (opposite: number, angle: number) => {
    const c = hypotenuse(opposite, angle);

    const b = Math.sqrt(Math.pow(c, 2) - Math.pow(opposite, 2));

    return (opposite * b) / 2;
};
