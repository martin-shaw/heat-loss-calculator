import { Surface } from "./surface";

export interface Room {
    name: string;
    temperature: number;
    surfaces: Surface[];
}
