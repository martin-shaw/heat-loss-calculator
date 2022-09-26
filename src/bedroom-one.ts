import { doubleBrick, doubleGlazing, plaster, singleBrick } from "./fabric/fabric";
import { Room } from "./room";

const room: Room = {
    name: "Bedroom 1",
    temperature: 18,
    surfaces: [
        {
            name: "external wall",
            width: 4.9,
            height: 2.8,
            composition: [doubleBrick, plaster],
            elements: [
                { name: "window 1", width: 0.95, height: 1.7, composition: doubleGlazing },
                { name: "window 2", width: 0.65, height: 1.7, composition: doubleGlazing },
            ],
        },
        { name: "party wall", width: 3.7, height: 2.8, composition: [plaster, doubleBrick, plaster] },
        { name: "party wall", width: 3.7, height: 2.8, composition: [plaster, doubleBrick, plaster] },
        { name: "internal wall", width: 4.9, height: 2.8, composition: [plaster, singleBrick, plaster] },
    ],
};
