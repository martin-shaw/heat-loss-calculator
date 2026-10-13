/**
 * Right-triangle area helper for gable geometry (utility, not a thermal model).
 * See: docs/MODELS.md (Surface geometry)
 * https://www.omnicalculator.com/math/right-triangle-area
 */
import { hypotenuse } from "./trig";

export const area = (opposite: number, angle: number) => {
    // isosceles triangle
    if (angle == 45) {
        return Math.pow(opposite, 2) / 2;
    }

    const c = hypotenuse(opposite, angle);

    const b = Math.sqrt(Math.pow(c, 2) - Math.pow(opposite, 2));

    return (opposite * b) / 2;
};
