import { sumAreas } from "./rect";
import { Room } from "./room";
import { Surface, calculateUValue } from "./surface";
import { defaultRoomTemperature } from "./settings";
import { Fabric, FabricComponent } from "./fabric";

export const calculate = (room: Room) => {};

interface CalculatedSurface {
    name: string;
    uValue: number;
    area: number;
    heatLoss: number;
}

export const calculateSurface = (surface: Surface, roomTemperature: number): CalculatedSurface[] => {
    const deltaT =
        roomTemperature - (surface.boundaryTemperature ? surface.boundaryTemperature : defaultRoomTemperature);

    const surfaces = [surface, ...(surface.elements ? surface.elements : [])];

    return surfaces.map((surface) => {
        const uValue = calculateSurfaceUValue(surface.composition);
        const area = calculateSurfaceArea(surface);
        // SAP model
        // https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/fabricheatloss
        // Heat loss = U-value x Area x Temperature Difference
        const heatLoss = uValue * area * deltaT;

        return {
            name: surface.name,
            uValue,
            area,
            heatLoss,
        };
    });
};

export const calculateSurfaceArea = (surface: Surface) => {
    let elementsArea = 0;

    if (surface.elements) {
        elementsArea = sumAreas(surface.elements);
    }

    return sumAreas([surface]) - elementsArea;
};

export const calculateSurfaceUValue = (composition: Fabric | FabricComponent[]) =>
    Array.isArray(composition) ? calculateUValue(composition) : composition.uValue;
