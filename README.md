# Heat loss calculator

Domestic room fabric heat-loss calculator. Surfaces are described by geometry and construction; heat loss is computed as:

```text
Q = U × A × ΔT
```

U-values come from RdSAP tables or from RdSAP / BR 443 ground-floor procedures (solid and suspended floors). Material λ values can also be stacked to derive a layered U-value.

## What the code is modelling

See **[docs/MODELS.md](docs/MODELS.md)** for the map of physical concepts → standard clauses → source modules, plus normative and background references.

See **[docs/METHODOLOGY-ARCHITECTURE.md](docs/METHODOLOGY-ARCHITECTURE.md)** for the proposed separation between method-neutral room definitions, methodology profiles and the shared fabric-loss engine.

## Run

```bash
npm test
```

```bash
npx ts-node src/index.ts
```
