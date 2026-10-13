# Models

This project calculates domestic room fabric heat loss. The primary methodology is **RdSAP / SAP-style** fabric loss (`Q = U · A · ΔT`), with U-values taken from RdSAP tables or derived from RdSAP / BR 443 ground-floor procedures.

CIBSE Guide A is retained as background and a possible alternate model (see open questions in tests).

## Map: concept → standard → code

| Concept | Status | Normative model | Module |
| -------- | ------ | --------------- | ------ |
| Fabric heat loss | implemented | SAP-style `Q = U · A · ΔT` | [`src/calculator.ts`](../src/calculator.ts) |
| Layered U-value from λ | implemented | `U = 1 / Σ(d/λ)` (combined method) | [`src/fabric.ts`](../src/fabric.ts) |
| RdSAP fabric defaults | implemented | RdSAP Tables S1, S3, S6, S8B, S14 | [`src/fabric.ts`](../src/fabric.ts) |
| Material k-values (λ) | implemented | Material thermal conductivity | [`src/k-value.ts`](../src/k-value.ts) |
| Solid floor U | implemented | RdSAP §S5 (ground floors) | [`src/solid-floor.ts`](../src/solid-floor.ts) |
| Solid floor U | approximate | BRE IP 3/90-style perimeter formula | [`src/solid-floor-bre-ip-3-90.ts`](../src/solid-floor-bre-ip-3-90.ts) |
| Solid floor U | lookup | gov.scot Table 6.C (P/A → U) | [`src/solid-floor-lookup.ts`](../src/solid-floor-lookup.ts) |
| Suspended floor U | implemented | RdSAP §S5.5 | [`src/suspended-floor.ts`](../src/suspended-floor.ts) |
| Room-in-roof | background | RdSAP / gov.scot notes | [`src/room-in-roof.ts`](../src/room-in-roof.ts) (links only) |
| Surface geometry | utility | Area net of openings / gables | [`src/surface.ts`](../src/surface.ts), [`src/triangle.ts`](../src/triangle.ts) ([omnicalculator](https://www.omnicalculator.com/math/right-triangle-area)) |

Status meanings:

- **implemented** — code aims to follow the cited clause
- **approximate** — engineering shortcut, not the full RdSAP derivation
- **lookup** — tabulated values, not a derived formula
- **background** — informs design; not (yet) coded as a model
- **utility** — geometry / plumbing, not a thermal standard

---

## Fabric heat loss

**What:** Steady-state heat flow through a room surface (W).

**Normative model:** SAP-style fabric heat loss  
`Heat loss = U-value × Area × Temperature difference`

**Implemented in:** `calculateSurfaceHeatloss` in [`src/calculator.ts`](../src/calculator.ts)

**Assumptions:**

- Default room temperature 20 °C (`src/settings.ts`)
- Default external temperature −3 °C when a surface has no `boundaryTemperature`
- ΔT uses room temperature minus boundary (or default room temperature for internal boundaries)

**Related alternatives:** Tests note a possible future split for SAP vs CIBSE surface heat-loss models (`src/calculator.test.ts`).

### References

**Normative / primary**

- [OpenEnergyMonitor — Fabric heat loss](https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/fabricheatloss) (clear statement of `Q = U·A·ΔT`)

**Background**

- [heatlossjs (Trystan Lea)](https://github.com/TrystanLea/heatlossjs)
- [trystanlea.org.uk](https://trystanlea.org.uk/)
- [Heat Geek — Heat losses](https://www.heatgeek.com/heat-losses/)

---

## Layered U-value (from k-values)

**What:** Thermal transmittance of a multi-layer construction from component thicknesses and λ.

**Normative model:** Combined method — R = d/λ per layer, U = 1 / ΣR  
(see also BR 443 / gov.scot worked examples)

**Implemented in:** `calculateRValue`, `calculateUValue` in [`src/fabric.ts`](../src/fabric.ts)

**Assumptions:** Plane layers in series; no thermal bridging or air-gap corrections beyond what is baked into a component’s λ.

### References

**Normative / primary**

- [BR 443 (2006)](https://www.bre.co.uk/filelibrary/rpts/uvalue/BR_443_(2006_Edition).pdf)
- [BR 443 consultation (2019)](https://www.bregroup.com/wp-content/uploads/2019/10/BR443-October-2019_consult.pdf)
- [gov.scot 6.B — Worked examples (combined method)](https://www.gov.scot/binaries/content/documents/govscot/publications/advice-and-guidance/2020/02/tables-of-u-values-and-thermal-conductivity/documents/6-b---worked-examples-of-u-value-calculations-using-the-combined-method/6-b---worked-examples-of-u-value-calculations-using-the-combined-method/govscot%3Adocument/6.B%2B-%2BWorked%2Bexamples%2Bof%2BU-value%2Bcalculations%2Busing%2Bthe%2Bcombined%2Bmethod%2B%2B.pdf)
- [Ibstock TIS A9 — Understanding k-values and U-values](https://www.ibstockbrick.co.uk/wp-content/uploads/2021/06/TIS-A9-UNDERSTANDING-K-VALUES-AND-U-VALUES-2021.pdf) (used in `fabric.test.ts` / `surface.test.ts`; worksheet scan: [`images/u-value-calibration.png`](../images/u-value-calibration.png))

**Background**

- [ArchDaily — How to calculate U-value](https://www.archdaily.com/898843/how-to-calculate-the-thermal-transmittance-u-value-in-the-envelope-of-a-building)
- [Designing Buildings Wiki — K-value](https://www.designingbuildings.co.uk/wiki/K-value_thermal_conductivity)

---

## RdSAP fabric defaults

**What:** Preset U-values for common existing-dwelling constructions (walls, glazing, party walls, floors/ceilings).

**Normative model:** RdSAP 2012 tables (England & Wales where noted)

| Constant | Table / note | Value in code |
| -------- | ------------ | ------------- |
| `RdSAPDoubleBrick` | S1 age band A (pre-1900), S3 solid brick 220 mm, S6 wall U-values | 2.1 W/m²K (comment notes historical 1.7) |
| `RdSAPPartyWall` | S8B party walls | 0 |
| `doubleGlazing` | S14 window characteristics (12 mm gap, PVC) | 2.8 |
| `internalFloor` / `internalCeiling` | internal separations | 1.7 |

**Implemented in:** [`src/fabric.ts`](../src/fabric.ts)  
**Used by:** room definitions (`bedroom-one.ts`, `bedroom-two.ts`, `bedroom-three.ts`)

### References

**Normative / primary**

- [RdSAP 2012 9.93 (BRE PDF)](https://www.bre.co.uk/filelibrary/SAP/2012/RdSAP-9.93/RdSAP_2012_9.93.pdf)
- [RdSAP 2012 9.94 (BRE)](https://bregroup.com/documents/d/bre-group/rdsap_2012_9-94-20-09-2019)
- [RdSAP 2012 9.93 consultation version](https://www.bre.co.uk/filelibrary/SAP/2016/RdSAP-2012-9.93--July-2016--CONSULTATION-VERSION-01-07-2016.pdf)
- [CONSP-16 — Wall U-values for existing dwellings (Table S6)](https://www.bre.co.uk/filelibrary/SAP/2016/CONSP-16---Wall-U-values-for-existing-dwellings---V1_0.pdf)
- [Elmhurst — U-value reference sources](https://heatloss.elmhurstenergy.co.uk/docs/reference-sources/u-values#external-wall-types)

**Background**

- [SAP consultation document](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/571939/SAP_consultation_document__with_links_.pdf)
- [WP2 — Nature of solid walls in situ](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/771765/WP2_Nature_of_solid_walls_in-situ_v3.2b.pdf)
- [gov.scot — Supplementary topic notes (EPCs)](https://www.gov.scot/publications/supplementary-topic-notes-review-domestic-non-domestic-energy-performance-certificates-scotland/pages/2/)

---

## Material k-values

**What:** Thermal conductivity λ of fabric materials (W/m·K).

**Normative model:** Published / manufacturer λ used as inputs to layered U-value calculation.

**Implemented in:** [`src/k-value.ts`](../src/k-value.ts)

**Assumptions:** `ecoWool` uses a manufacturer value; other constants are typical handbook values pending a single cited source table.

### References

**Background**

- [Designing Buildings Wiki — K-value](https://www.designingbuildings.co.uk/wiki/K-value_thermal_conductivity)
- [Kaye & Laby (archived) — thermal conductivity](https://web.archive.org/web/20190503215407/http://www.kayelaby.npl.co.uk/general_physics/2_3/2_3_7.html)
- [Green Building Forum discussion](http://www.greenbuildingforum.co.uk/newforum/comments.php?DiscussionID=15028)
- [Ibstock TIS A9](https://www.ibstockbrick.co.uk/wp-content/uploads/2021/06/TIS-A9-UNDERSTANDING-K-VALUES-AND-U-VALUES-2021.pdf)

---

## Solid floor U-value (RdSAP)

**What:** U-value of an uninsulated or insulated solid ground floor.

**Normative model:** RdSAP §S5 — floors next to the ground (solid floor procedure)

**Implemented in:** [`src/solid-floor.ts`](../src/solid-floor.ts)

**Assumptions:**

- Soil: clay, λg = 1.5 W/m·K
- Rsi = 0.17 m²K/W, Rse = 0.04 m²K/W
- Inputs: wall thickness `w`, area `A`, exposed perimeter `P`, floor deck resistance `Rf`

**Steps (as coded):**

1. `dt = w + λg × (Rsi + Rf + Rse)`
2. `B = 2 × A / P`
3. If `dt < B`: `U = 2 × λg × ln(π × B/dt + 1) / (π × B + dt)`  
   The logarithm is `ln(πB/dt + 1)`, not `ln(π(B/dt + 1))`.
4. If `dt ≥ B`: `U = λg / (0.457 × B + dt)`

**Related alternatives:** [`solid-floor-bre-ip-3-90.ts`](#solid-floor-u-value-bre-ip-390-approximate), [`solid-floor-lookup.ts`](#solid-floor-u-value-lookup)

**Verified by:** `src/solid-floor.test.ts` (RdSAP calibration cases)

### References

**Normative / primary**

- [RdSAP 2012 9.93 — §S5](https://www.bre.co.uk/filelibrary/SAP/2012/RdSAP-9.93/RdSAP_2012_9.93.pdf)

---

## Solid floor U-value (BRE IP 3/90 approximate)

**What:** Quick U-value for an uninsulated solid floor from perimeter/area only.

**Normative model:** BRE IP 3/90-style approximation (as presented in Heat Engineer guidance)  
`U = 0.05 + 1.65(P/A) − 0.6(P/A)²`

**Implemented in:** [`src/solid-floor-bre-ip-3-90.ts`](../src/solid-floor-bre-ip-3-90.ts)

**Assumptions:** Uninsulated floor; no explicit wall thickness or soil type.

### References

**Normative / primary**

- [Heat Engineer Help Guide](https://www.heat-engineer.com/pdf/HelpGuide.pdf)

---

## Solid floor U-value (lookup)

**What:** U-value from exposed perimeter / area ratio via a discrete table.

**Normative model:** gov.scot Table 6.C — U-values of ground floors and basements

**Implemented in:** [`src/solid-floor-lookup.ts`](../src/solid-floor-lookup.ts)

**Assumptions:** Exact table keys return that row. Between keys, U is linearly interpolated. Below the first key (P/A = 0.05), the first row (0.13) is returned. Above the last key (P/A = 0.50), the last segment is extrapolated, so P/A = 0.80 is 1.00 rather than a cap of 0.70.

**Source scan:** [`images/solid-ground-floors-u-value-table.png`](../images/solid-ground-floors-u-value-table.png) (Table 6.C.2)

### References

**Normative / primary**

- [gov.scot 6.C — U-values of ground floors and basements](https://www.gov.scot/binaries/content/documents/govscot/publications/advice-and-guidance/2020/02/tables-of-u-values-and-thermal-conductivity/documents/6-c---u-values-of-ground-floors-and-basements/6-c---u-values-of-ground-floors-and-basements/govscot%3Adocument/6.C%2B-%2BU-values%2Bof%2Bground%2Bfloors%2Band%2Bbasements%2B%2B.pdf)

---

## Suspended floor U-value

**What:** U-value of a suspended timber ground floor (with optional insulation resistance).

**Normative model:** RdSAP §S5.5 — U-values of floors next to the ground (suspended)

**Implemented in:** [`src/suspended-floor.ts`](../src/suspended-floor.ts)

**Assumptions / defaults:**

| Symbol | Meaning | Default in code |
| ------ | ------- | --------------- |
| λg | Soil conductivity (clay) | 1.5 W/m·K |
| Rsi | Internal surface resistance | 0.17 m²K/W |
| Rse | External surface resistance | 0.04 m²K/W |
| ε | Ventilation openings per m exposed perimeter | 0.003 m²/m |
| Rf | Floor deck thermal resistance (uninsulated) | 0.2 m²K/W |
| Uw | U-value of walls to underfloor space | 1.5 W/m²K (S5.5) |
| v | Wind speed | 5 m/s |
| fw | Wind shielding factor | 0.05 |

**Open question:** S5.5 sets Uw = 1.5 W/m²K; that differs from the ~2.1 value used elsewhere for 220 mm solid wall (`RdSAPDoubleBrick`). Documented in code comments; not resolved.

**Steps (as intended by RdSAP / comments):**

1. `dg = w + λg × (Rsi + Rse)`
2. `B = 2 × A / P`
3. If `dg < B`: `Ug = 2 × λg × ln(π × B/dg + 1) / (π × B + dg)`  
   If `dg ≥ B`: `Ug = λg / (0.457 × B + dg)` (ISO 13370; RdSAP 9.93 prints only the log form)
4. `Ux = (2 × h × Uw / B) + (1450 × ε × v × fw / B)`
5. `U = 1 / (2 × Rsi + Rf + 1/(Ug + Ux))`  
   (Rf includes optional insulation thermal resistance. The `1/(Ug + Ux)` term is a single resistance, not `(2·Rsi + Rf + 1) / (Ug + Ux)`.)

**Verified by:** `src/suspended-floor.test.ts` — ScienceDirect / White Rose case study calibration (uninsulated, woodfibre, bead insulation). Case-study geometry and assumptions: [`images/calibration-model-assumptions.png`](../images/calibration-model-assumptions.png).

### References

**Normative / primary**

- [RdSAP 2012 9.93 — §S5.5](https://www.bre.co.uk/filelibrary/SAP/2012/RdSAP-9.93/RdSAP_2012_9.93.pdf)
- [RdSAP 2012 9.94](https://bregroup.com/documents/d/bre-group/rdsap_2012_9-94-20-09-2019)

**Background / calibration**

- [ScienceDirect — Suspended timber ground floors measured heat loss vs models](https://www.sciencedirect.com/science/article/pii/S0378778817311350)
- [White Rose ePrints — same paper (PDF)](https://eprints.whiterose.ac.uk/116433/14/Suspended%20timber%20ground%20floors%20measured%20heat%20loss%20compared%20with%20models.pdf)
- [Pelsmakers floor PhD](https://discovery.ucl.ac.uk/id/eprint/1505859/1/PELSMAKERS_floorPhD_2016_loRes.pdf)
- [BR 443 consultation (2019)](https://www.bregroup.com/wp-content/uploads/2019/10/BR443-October-2019_consult.pdf)
- [CIBSE Guide A — Environmental design](http://ierga.com/hr/wp-content/uploads/sites/2/2017/10/CIBSE-Guide-A-Environmental-design.pdf)

---

## Room-in-roof

**What:** Guidance for modelling rooms in the roof (not yet a coded thermal procedure).

**Status:** background — links only in [`src/room-in-roof.ts`](../src/room-in-roof.ts)

### References

**Background**

- [gov.scot REEPS modelling — room in roof](https://www.gov.scot/publications/developing-regulation-energy-efficiency-private-sector-housing-reeps-modelling-improvements-target-stock-main-research-report/pages/9/)
- [gov.scot supplementary topic notes — room in roof / RdSAP](https://www.gov.scot/publications/supplementary-topic-notes-review-domestic-non-domestic-energy-performance-certificates-scotland/pages/4/)
- [Retrofit room-in-roof insulation best practice](https://assets.publishing.service.gov.uk/media/61d727d18fa8f50594b59305/retrofit-room-in-roof-insulation-best-practice.pdf)

---

## CIBSE and other design guides

Not the primary implementation target today; kept because they define alternate environmental design / heat-loss practice and may support a future model variant.

### References

**Background**

- [CIBSE Guide A (ilearn.fife copy)](https://ilearn.fife.ac.uk/pluginfile.php/105852/mod_resource/content/1/CIBSE%20Guide%20A_%20Environmental%20Design%5B1%5D.pdf) (notes: ~p100)
- [CIBSE Guide A (ierga copy)](http://ierga.com/hr/wp-content/uploads/sites/2/2017/10/CIBSE-Guide-A-Environmental-design.pdf) (notes: ~p135)
