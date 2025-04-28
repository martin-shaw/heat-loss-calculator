import { internalCeiling, internalFloor, plaster, RdSAPDoubleBrick, RdSAPPartyWall, singleBrick } from "./fabric";
import { Room } from "./room";
import * as kValues from "./k-value";

export const room: Room = {
    name: "Bedroom 3",
    temperature: 18,
    surfaces: [
        {
            name: "external wall",
            width: 4.9,
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
            gables: [{ roofBase: 1.2, roofAngle: 30 }],
        },
        {
            name: "party wall",
            width: 3.7,
            height: 2.8,
            composition: RdSAPPartyWall,
            boundaryTemperature: 18,
            gables: [{ roofBase: 1.2, roofAngle: 30 }],
        },
        {
            name: "internal wall",
            width: 4.9,
            height: 2.8,
            composition: [plaster, singleBrick, plaster],
            boundaryTemperature: 18,
        },
        { name: "internal floor", width: 4.9, height: 3.7, composition: internalFloor, boundaryTemperature: 18 },
        {
            name: "roof",
            width: 4.9,
            height: 3.7,
            composition: [{ name: "pir", thickness: 0.1, kValue: kValues.pir }],
            boundaryTemperature: -3,
        },
    ],
};

// is flat ceiling treated as loft space?
