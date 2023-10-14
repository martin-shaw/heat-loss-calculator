// Soil type clay (thermal conductivity λg = 1.5 W/m·K)
const clayThermalConductivity = 1.5;
const Rsi = 0.17;
const Rse = 0.04;

interface Model {
    wallThickness: number;
    area: number;
    exposedPerimiter: number;
    rf: number;
}

/**
 * https://www.bre.co.uk/filelibrary/SAP/2012/RdSAP-9.93/RdSAP_2012_9.93.pdf
 */
export const calculate = (model: Model) => {
    const { wallThickness, area, exposedPerimiter, rf } = model;

    // 1. dt = w + λg × (Rsi + Rf + Rse)
    const dt = wallThickness + clayThermalConductivity * (Rsi + rf + Rse);

    // 2. B = 2 × A/P
    const b = 2 * (area / exposedPerimiter);

    // 3. if dt < B
    // 4. if dt >= B
    const u =
        dt < b
            ? // U = 2 × λg × ln(π × B/dt + 1)/(π × B + dt)
              (2 * clayThermalConductivity * Math.log(Math.PI * (b / dt + 1))) / (Math.PI * b + dt)
            : // U = λg/(0.457 × B + dt)
              clayThermalConductivity / (0.457 * b + dt);

    return u;
};
