import { Fabric, FabricComponent } from "./fabric";
import { Rect } from "./rect";

export interface Surface extends Rect {
    name: string;
    boundaryTemperature?: number;
    composition: Fabric | FabricComponent[];
    elements?: Surface[];
    gables?: Gable[];
}

export interface Gable {
    roofBase: number;
    roofAngle: number;
}
