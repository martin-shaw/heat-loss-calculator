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
    name: "Bedroom 1",
    temperature: 18,
    surfaces: [
        {
            name: "external wall",
            width: 4.9,
            height: 2.8,
            composition: RdSAPDoubleBrick,
            boundaryTemperature: -3,
            elements: [
                { name: "window 1", width: 0.95, height: 1.7, composition: doubleGlazing },
                { name: "window 2", width: 0.65, height: 1.7, composition: doubleGlazing },
            ],
        },
        {
            name: "party wall",
            width: 3.7,
            height: 2.8,
            composition: RdSAPPartyWall,
            boundaryTemperature: 18,
        },
        {
            name: "party wall",
            width: 3.7,
            height: 2.8,
            composition: RdSAPPartyWall,
            boundaryTemperature: 18,
        },
        {
            name: "internal wall",
            width: 4.9,
            height: 2.8,
            composition: [plaster, singleBrick, plaster],
            boundaryTemperature: 18,
        },
        { name: "internal floor", width: 4.9, height: 3.7, composition: internalFloor, boundaryTemperature: 18 },
        { name: "internal ceiling", width: 4.9, height: 3.7, composition: internalCeiling, boundaryTemperature: 18 },
    ],
};
