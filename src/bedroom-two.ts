import {
    doubleGlazing,
    internalCeiling,
    internalFloor,
    plaster,
    RdSAPDoubleBrick,
    RdSAPPartyWall,
    singleBrick,
} from "./fabric";
import { Room } from "./room";

export const room: Room = {
    name: "Bedroom 2",
    temperature: 18,
    surfaces: [
        {
            name: "external wall",
            width: 3.1,
            height: 2.8,
            composition: RdSAPDoubleBrick,
            boundaryTemperature: -3,
            elements: [{ name: "window 1", width: 1, height: 1.65, composition: doubleGlazing }],
        },
        {
            name: "party wall",
            width: 3.9,
            height: 2.8,
            composition: RdSAPPartyWall,
            boundaryTemperature: 18,
        },
        {
            name: "internal wall",
            width: 3.9,
            height: 2.8,
            composition: [plaster, singleBrick, plaster],
            boundaryTemperature: 18,
        },
        {
            name: "internal wall",
            width: 3.1,
            height: 2.8,
            composition: [plaster, singleBrick, plaster],
            boundaryTemperature: 18,
        },
        { name: "internal floor", width: 3.9, height: 3.1, composition: internalFloor, boundaryTemperature: 18 },
        { name: "internal ceiling", width: 3.9, height: 3.1, composition: internalCeiling, boundaryTemperature: 18 },
    ],
};
