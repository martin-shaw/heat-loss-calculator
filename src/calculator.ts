import { sum } from "./rect";
import { Room } from "./room";
import { Surface, calculateUValue } from "./surface";

export const calculate = (room: Room) => {};

export const calculateSurface = (surface: Surface, roomTemperature: number) => {
    const uValue = Array.isArray(surface.composition)
        ? calculateUValue(surface.composition)
        : surface.composition.uValue;

    const area = calculateSurfaceArea(surface);
    const deltaT =
        roomTemperature - (surface.boundaryTemperature ? surface.boundaryTemperature : defaultRoomTemperature);

    // SAP model
    // https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/fabricheatloss
    // Heat loss = U-value x Area x Temperature Difference
    const heatLoss = uValue * area * deltaT;
};

export const calculateSurfaceArea = (surface: Surface) => {
    let elementsArea = 0;

    if (surface.elements) {
        elementsArea = sum(surface.elements);
    }

    return sum([surface]) - elementsArea;
};
