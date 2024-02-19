export const hypotenuse = (opposite: number, angle: number) => Math.floor(opposite / Math.sin(radians(angle)));

const radians = (degress: number) => (degress * Math.PI) / 180;
