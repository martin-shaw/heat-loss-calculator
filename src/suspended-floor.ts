const windSpeed = 5;
const windSheildingFactor = 0.05;
const ventilation = 0.003;
const heightAboveGround = 0.3;

const clayThermalConductivity = 1.5;
const Rsi = 0.17;
const Rse = 0.04;
// Thermal resistance of floor deck Rf = 0.2 m²K/W if uninsulated,
// or Rf = thermal resistance of insulation + 0.2 if insulated
const Rf = 0.2;
const wallUValue = 1.5;

/**
 * https://www.bre.co.uk/filelibrary/SAP/2012/RdSAP-9.93/RdSAP_2012_9.93.pdf
 */
export const calculate = (wallThickness: number, area: number, exposedPerimiter: number) => {
    const dg = wallThickness + clayThermalConductivity * (Rsi + Rse);
    console.log("dg", dg);
    const b = 2 * (area / exposedPerimiter);
    console.log("b", b);

    // 3. Ug = 2 × g × ln( × B/dg + 1)/( × B + dg)
    const ug = (2 * clayThermalConductivity * Math.log(Math.PI * (b / dg + 1))) / (Math.PI * b + dg);
    console.log("ug", ug);

    // 4. Ux = (2 × h × Uw/B) + (1450 ×  × v × fw/B)
    const ux = (2 * heightAboveGround * wallUValue) / b + (1450 * ventilation * windSpeed * windSheildingFactor) / b;
    console.log("ux", ux);

    // 5. U = 1 / (2 × Rsi + Rf + 1/(Ug + Ux))
    const u = 1 / ((2 * Rsi + Rf + 1) / (ug + ux));

    return u;
};
