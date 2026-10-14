# Methodology architecture proposal

**Status:** Proposed  
**Purpose:** Record how calculation methods are currently combined and define a future architecture that supports alternative methods without silently mixing them or coupling room definitions to one method.

## Summary

The calculator currently has a useful shared fabric-loss kernel:

```text
Qfabric = Σ(U × A × ΔT)
```

That equation can be reused across several approaches. A complete heat-loss methodology, however, also defines how U-values, boundary temperatures, ventilation, thermal bridging, geometry and final totals are determined.

The intended direction is therefore:

1. Keep room and building definitions as method-neutral descriptions of physical facts.
2. Select one named methodology profile for a calculation.
3. Let that profile resolve method-dependent inputs and result terms.
4. Keep alternative element procedures separate and record the source of every resolved value.
5. Permit mixtures only through an explicitly named and validated custom or comparison profile.

## What the named methodologies are

The names currently found in the project do not all describe equivalent, whole-room methodologies.

### RdSAP

RdSAP is a reduced-data assessment procedure for existing dwellings. It defines much more than the `U × A × ΔT` equation, including default fabric values, ground-floor procedures and assessment conventions.

The project currently implements or uses selected RdSAP parts:

- fabric defaults from tables such as S6, S8B and S14;
- solid ground-floor U-values from §S5;
- suspended timber ground-floor U-values from §S5.5.

This does not yet constitute a complete RdSAP assessment engine. The current room calculation is best described as steady-state, SAP-style fabric heat loss using selected RdSAP inputs.

### BRE IP 3/90

BRE IP 3/90 is represented by a perimeter-to-area approximation for an uninsulated solid ground floor:

```text
U = 0.05 + 1.65(P/A) − 0.6(P/A)²
```

It is a floor U-value procedure, not a complete room heat-loss methodology. Selecting it determines a floor U-value but does not determine wall values, design temperatures, ventilation, thermal bridging or result aggregation.

### ISO 13370

ISO 13370 concerns heat transfer through floors and other elements in thermal contact with the ground. It is likewise not a complete room heat-loss methodology.

A broader design calculation can use ISO 13370 for ground coupling while using other procedures for walls, roofs, glazing, ventilation and thermal bridges. The current suspended-floor code uses the ISO 13370 small-floor ground branch when `dg >= B`, because that branch is not printed in the cited RdSAP expression.

### ISO 6946 and layered U-values

ISO 6946 concerns thermal resistance and transmittance of building components. The current series calculation uses:

```text
U = 1 / (Rsi + Σ(d/λ) + Rse)
```

This is an element U-value calculation. It does not define a room heat-loss result. The ISO 6946 combined method for bridged or inhomogeneous layers is not implemented.

### gov.scot Table 6.C lookup

The lookup is another way of obtaining an uninsulated ground-floor U-value from `P/A`. Values between tabulated rows are interpolated. The current implementation also extrapolates above the last supported uninsulated table row; that extrapolation is a project behaviour, not a value supplied by the table.

This lookup is an element-level alternative, not a whole-room methodology.

### CIBSE and design heat loss

CIBSE material is currently background only. No CIBSE room heat-loss methodology is implemented.

A future design-heat-loss profile could use explicit design temperatures, ISO element and ground calculations, a declared infiltration or ventilation procedure, and explicit thermal-bridge terms. It should be distinguished from an RdSAP assessment, particularly if the result is intended for emitter sizing or peak design load.

## Current implementation

### Shared calculation

`calculateRoom` in `src/calculator.ts`:

1. calculates net areas by subtracting openings and gables;
2. obtains a U-value from either a finished `Fabric` value or a layered construction;
3. calculates `U × A × ΔT` for each surface;
4. sums the surface fabric losses.

Ventilation and thermal bridging are separate functions and are not included in `calculateRoom`.

### Current coupling and mixing

The sample room definitions are coupled to selected calculation assumptions:

- Bedrooms import finished RdSAP wall, party-wall and glazing constants directly.
- Layered internal walls use explicit surface resistances and are calculated from material layers.
- Each surface stores a resolved boundary temperature rather than an adjacency from which a methodology can derive the boundary condition.
- Bedroom 3 contains a layered roof alongside RdSAP table-derived wall values.
- Internal floor and ceiling use a project value of `1.7 W/m²K`, explicitly not an RdSAP Table S12 value. Their sample-room temperature difference is zero, so they currently contribute no heat loss.
- The ground-floor alternatives are separate functions and calibration tests. `calculateRoom` does not average or automatically combine them; a caller must first choose one U-value and assign it to a floor.
- The suspended-floor procedure is labelled RdSAP §S5.5 but includes the ISO 13370 `dg >= B` ground branch.

Consequently, a room can contain U-values from different sources, but the result does not retain their provenance and no profile validates whether the combination is consistent.

This is not currently an accidental blend of the BRE, lookup and RdSAP floor results: those alternatives coexist but are called separately. The mixing risk is that callers can freely place any resolved values into the same room without identifying or validating the resulting approach.

## Proposed separation

### 1. Survey definitions

Room and building definitions should contain physical or observed facts:

- dimensions and geometry;
- adjacency, such as outside, ground, another heated room or an unheated space;
- construction layers or a declared measured U-value;
- openings;
- room design temperature;
- slab identity;
- exposed perimeter and whole-slab area;
- ventilation observations or design inputs.

Reusable definitions should not import an RdSAP table constant or store a methodology-derived boundary temperature.

A measured or externally supplied U-value may be stored as an explicit override, but it must include its source and applicability.

### 2. Building context

Some calculations cannot be resolved correctly from a room alone. Ground-floor methods need whole-slab or extension area and exposed perimeter, not merely the floor area of one room.

A `BuildingContext` should therefore own shared facts such as:

- slabs and the rooms that belong to each slab;
- dwelling exposure and location inputs;
- construction age and type;
- junction and exposed-area information;
- external and adjacent-zone design conditions.

### 3. Methodology profile

A calculation should select one named profile:

```ts
interface HeatLossMethodology {
    id: string;

    resolveUValue(
        surface: SurfaceDefinition,
        building: BuildingContext
    ): ResolvedUValue;

    resolveBoundaryTemperature(
        surface: SurfaceDefinition,
        context: CalculationContext
    ): ResolvedBoundary;

    calculateVentilation(
        room: RoomDefinition,
        context: CalculationContext
    ): HeatLossTerm;

    calculateThermalBridging(
        room: RoomDefinition,
        context: CalculationContext
    ): HeatLossTerm;

    aggregate(terms: HeatLossTerm[]): HeatLossResult;
}
```

The profile controls:

- permitted U-value sources and defaults;
- ground-floor procedure;
- surface-resistance conventions;
- boundary conditions;
- party-wall treatment;
- ventilation or infiltration method;
- thermal-bridge treatment;
- included terms and aggregation.

### 4. Shared fabric engine

The existing geometry and `U × A × ΔT` logic should remain a shared low-level engine. It should consume resolved inputs rather than choose a methodology:

```ts
calculateFabricLoss(resolvedRoom): FabricLossResult
```

A higher-level operation should resolve and calculate:

```ts
calculateRoom(room, building, methodology): HeatLossResult
```

The returned result should keep separate terms:

- fabric;
- ventilation;
- thermal bridging;
- total, where the selected profile defines one.

### 5. Provenance

Every resolved value should record where it came from:

```ts
interface ResolvedUValue {
    value: number;
    method:
        | "rdsap-table"
        | "rdsap-floor"
        | "bre-ip-3-90"
        | "iso-13370"
        | "iso-6946-series"
        | "table-6c"
        | "measured"
        | "explicit";
    source: string;
    assumptions: string[];
}
```

The result can then explain its inputs and tests can assert that a supposedly pure profile did not use an incompatible resolver.

## Proposed profiles

### RdSAP profile

An RdSAP profile would permit only the implemented RdSAP tables and clauses, plus clearly documented project inputs where RdSAP requires information not yet modelled. Unsupported cases should fail rather than silently falling back to another method.

Because the current implementation covers only selected RdSAP parts, this profile should initially be labelled as partial.

### ISO-based design profile

A design profile could use:

- ISO 6946 series element U-values;
- ISO 13370 ground heat transfer;
- explicit room and external design temperatures;
- a declared ventilation or infiltration procedure;
- explicit thermal-bridge calculations.

The exact ventilation, thermal-bridge and design-condition standards must be named before treating this as a complete methodology.

### BRE floor comparison profile

BRE IP 3/90 should initially remain an alternative floor resolver used for comparison. If it is used in a room result, the encompassing profile must define all the other assumptions.

For example, `design-with-bre-ip-3-90-floor` is an honest profile name. Calling the whole result simply `BRE` would overstate what that floor formula defines.

### Explicit custom or hybrid profile

There are legitimate reasons to compare or combine sources. Such a calculation must:

- use an explicitly named custom or hybrid profile;
- list every selected resolver;
- emit provenance in the result;
- never be labelled as a pure RdSAP or ISO calculation.

## Validation rules

A profile should reject:

- an element resolver that the profile has not permitted;
- room-level perimeter being supplied where whole-slab perimeter is required;
- missing adjacency or boundary information;
- layered U-values without applicable surface resistances;
- duplicated ventilation or thermal-bridge terms;
- a fallback from an unsupported RdSAP case to BRE or ISO without explicit configuration;
- an extrapolated lookup value where the profile permits only tabulated support.

## Migration path

1. Add provenance to existing `Fabric` and calculated U-values without changing numerical results.
2. Separate physical room definitions from resolved `Surface` inputs.
3. Introduce `BuildingContext`, including shared slabs.
4. Wrap the current behaviour in a named `legacy` profile to preserve existing tests.
5. Add a partial RdSAP profile and reject unsupported paths.
6. Add an explicitly named ISO-based design profile once its non-fabric conventions are selected.
7. Retain BRE IP 3/90 and Table 6.C as comparison resolvers.
8. Update tests to run the same survey model through multiple profiles and verify both values and provenance.
9. Remove direct imports of methodology-specific constants from reusable room definitions.

## Decision to carry forward

Room definitions will not be based on one methodology. A calculation scenario will select a methodology profile and apply it consistently across the building or comparison run.

The low-level fabric equation can remain shared. Method-specific choices will be resolved before it runs, while ventilation, thermal bridging and aggregation remain visible, separately testable terms.

