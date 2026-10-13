export const hypotenuse = (opposite: number, angle: number) => opposite / Math.sin(radians(angle));

const radians = (degress: number) => (degress * Math.PI) / 180;
