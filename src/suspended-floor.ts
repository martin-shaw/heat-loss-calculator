const windSpeed = 5;
const windSheildingFactor = 0.05;
// Ventilation openings per m exposed perimeter ε = 0.003 m²/m
const ventilation = 0.003;
// Soil type clay (thermal conductivity λg = 1.5 W/m·K)
const clayThermalConductivity = 1.5;
const Rsi = 0.17;
const Rse = 0.04;
// Thermal resistance of floor deck Rf = 0.2 m²K/W if uninsulated,
// or Rf = thermal resistance of insulation + 0.2 if insulated
const Rf = 0.2;
const wallUValue = 2.0;

/**
 * https://www.bre.co.uk/filelibrary/SAP/2012/RdSAP-9.93/RdSAP_2012_9.93.pdf
 */
export const calculate = (
    wallThickness: number,
    area: number,
    exposedPerimiter: number,
    heightAboveGround: number,
    insulationThermalResistance: number = 0
) => {
    const floorThermalResistance = Rf + insulationThermalResistance;

    // 1. dg = w + λg × (Rsi + Rse)
    const dg = wallThickness + clayThermalConductivity * (Rsi + Rse);

    // 2. B = 2 × A/P
    const b = 2 * (area / exposedPerimiter);

    // 3. Ug = 2 × λg × ln(π × B/dg + 1)/(π × B + dg)
    const ug = (2 * clayThermalConductivity * Math.log(Math.PI * (b / dg + 1))) / (Math.PI * b + dg);

    // 4. Ux = (2 × h × Uw/B) + (1450 × ε × v × fw/B)
    const ux = (2 * heightAboveGround * wallUValue) / b + (1450 * ventilation * windSpeed * windSheildingFactor) / b;

    // 5. U = 1 / (2 × Rsi + Rf + 1/(Ug + Ux))
    const u = 1 / ((2 * Rsi + floorThermalResistance + 1) / (ug + ux));

    return u;
};
