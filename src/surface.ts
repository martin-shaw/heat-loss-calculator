import { Fabric, FabricComponent } from "./fabric";
import { Rect } from "./rect";
import { sum } from "./math";

export interface Surface extends Rect {
    name: string;
    boundaryTemperature?: number;
    composition: Fabric | FabricComponent[];
    elements?: Surface[];
}

export const calculateUValue = (fabrics: FabricComponent[]) =>
    1 / sum(fabrics.map((fabric) => fabric.thickness / fabric.kValue.value));
