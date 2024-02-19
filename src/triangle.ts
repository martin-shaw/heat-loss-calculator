import { hypotenuse } from "./trig";

export const area = (opposite: number, angle: number) => {
    const c = hypotenuse(opposite, angle);

    const b = Math.sqrt(Math.pow(c, 2) - Math.pow(opposite, 2));

    return (opposite * b) / 2;
};
