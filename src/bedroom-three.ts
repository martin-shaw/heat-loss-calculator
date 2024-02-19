import { internalCeiling, internalFloor, plaster, RdSAPDoubleBrick, RdSAPPartyWall, singleBrick } from "./fabric";
import { Room, RoomInRoof } from "./room";

export const room: RoomInRoof = {
    type: "room-in-roof",
    name: "Bedroom 3",
    temperature: 18,
    surfaces: [
        {
            name: "external wall",
            width: 2.4,
            height: 1.2,
            composition: RdSAPDoubleBrick,
            boundaryTemperature: -3,
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
    gableWalls: [
        {
            name: "party wall",
            width: 3.8,
            height: 2.7,
            composition: RdSAPPartyWall,
            boundaryTemperature: 18,
            roofBase: 1.2,
            roofApex: 1.5,
            roofAngle: 30,
        },
    ],
};
