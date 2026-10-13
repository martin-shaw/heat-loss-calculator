/**
 * Surface geometry and composition (utility for fabric heat loss).
 * See: docs/MODELS.md (Surface geometry)
 */
import { Fabric, FabricComponent, SurfaceResistances } from "./fabric";
import { Rect } from "./rect";

export interface Surface extends Rect {
    name: string;
    boundaryTemperature?: number;
    composition: Fabric | FabricComponent[];
    /** Required when composition is a list of layers. Table U-values already include surface resistances. */
    surfaceResistances?: SurfaceResistances;
    elements?: Surface[];
    gables?: Gable[];
}

export interface Gable {
    roofBase: number;
    roofAngle: number;
}
