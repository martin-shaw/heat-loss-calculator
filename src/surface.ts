import { Fabric, FabricComponent } from "./fabric";
import { Rect } from "./rect";
import { sum } from "./math";

export interface Surface extends Rect {
    name: string;
    boundaryTemperature?: number;
    composition: Fabric | FabricComponent[];
    elements?: Surface[];
    gables?: Gable[];
}

export interface Gable {
    roofBase: number;
    roofApex: number;
    roofAngle: number;
}

export const calculateUValue = (fabrics: FabricComponent[]) =>
    1 / sum(fabrics.map((fabric) => fabric.thickness / fabric.kValue.value));
