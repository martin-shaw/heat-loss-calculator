import { Fabric } from "./fabric/fabric";
import { Rect } from "./rect";

export interface Surface extends Rect {
    name: string;
    boundaryTemperature?: number;
    composition: Fabric[];
    elements?: Surface[];
}
