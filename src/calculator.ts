import { sumAreas } from "./rect";
import { Room } from "./room";
import { Surface, calculateUValue } from "./surface";
import { defaultRoomTemperature } from "./settings";
import { Fabric, FabricComponent } from "./fabric";
import { sum } from "./math";

interface CalculatedRoom {
    area: number;
    heatLoss: number;
}
interface CalculatedSurface {
    name: string;
    // uValue: number;
    area: number;
    heatLoss: number;
}

export const calculateRoom = (room: Room): CalculatedRoom => {
    const surfaces = room.surfaces.map((surface) => calculateSurface(surface, room.temperature));
    // room.wk += e.wk
    // room.heat += e.heat
    // room.kwh += e.kwh
    // room.A += e.A
    return {
        area: sum(surfaces.map((surface) => surface.area)),
        heatLoss: sum(surfaces.map((surface) => surface.heatLoss)),
    };
};

export const calculateSurface = (surface: Surface, roomTemperature: number): CalculatedSurface => {
    const deltaT =
        roomTemperature - (surface.boundaryTemperature ? surface.boundaryTemperature : defaultRoomTemperature);

    const surfaces = [surface, ...(surface.elements ? surface.elements : [])];

    const calculatedSurfaces = surfaces.map((surface) => {
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

    return {
        name: surface.name,
        area: sum(calculatedSurfaces.map((surface) => surface.area)),
        heatLoss: sum(calculatedSurfaces.map((surface) => surface.heatLoss)),
    };
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
