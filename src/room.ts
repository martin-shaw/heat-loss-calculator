import { GableWall, Surface } from "./surface";

export interface Room {
    type: "room";
    name: string;
    temperature: number;
    surfaces: Surface[];
}

export interface RoomInRoof {
    type: "room-in-roof";
    name: string;
    temperature: number;
    surfaces: Surface[];
    gableWalls: GableWall[];
}
