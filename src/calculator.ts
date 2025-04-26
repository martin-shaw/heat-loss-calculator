import { sumAreas } from "./rect";
import { Room } from "./room";
import { Surface, calculateUValue } from "./surface";
import { defaultRoomTemperature } from "./settings";
import { Fabric, FabricComponent } from "./fabric";
import { sum } from "./math";
import { area as triangleArea } from "./triangle";

interface CalculatedRoom {
    area: number;
    heatLoss: number;
    surfaces: CalculatedSurface[];
}

interface CalculatedSurface {
    name: string;
    area: number;
    heatLoss: number;
}

interface CalculatedSurfaceArea {
    name: string;
    composition: Fabric | FabricComponent[];
    area: number;
}

export const calculateRoom = (room: Room) => {
    const calculatedSurfaces = room.surfaces.map((surface) => {
        const surfaceAreas = calculateSurfaceAreas(surface);

        return {
            name: surface.name,
            area: sum(surfaceAreas.map((surfaceArea) => surfaceArea.area)),
            heatLoss: sum(
                surfaceAreas.map((surfaceArea) =>
                    calculateSurfaceHeatloss(surfaceArea, room.temperature, surface.boundaryTemperature)
                )
            ),
        };
    });

    return {
        area: sum(calculatedSurfaces.map((calculatedSurface) => calculatedSurface.area)),
        heatLoss: sum(calculatedSurfaces.map((calculatedSurface) => calculatedSurface.heatLoss)),
        surfaces: calculatedSurfaces,
    };
};

export const calculateSurfaceAreas = (surface: Surface) => {
    const flattenedSurfaces = [surface, ...(surface.elements ? surface.elements : [])];

    return flattenedSurfaces.map((surface) => ({
        name: surface.name,
        composition: surface.composition,
        area: calculateSurfaceArea(surface),
    }));
};

export const calculateSurfaceHeatloss = (
    surface: CalculatedSurfaceArea,
    roomTemperature: number,
    boundaryTemperature?: number
) => {
    const deltaT = roomTemperature - (boundaryTemperature ? boundaryTemperature : defaultRoomTemperature);

    const uValue = calculateSurfaceUValue(surface.composition);
    // SAP model
    // https://learn.openenergymonitor.org/sustainable-energy/building-energy-model/fabricheatloss
    // Heat loss = U-value x Area x Temperature Difference
    return uValue * surface.area * deltaT;
};

export const calculateSurfaceArea = (surface: Surface) => {
    let elementsArea = 0;
    let gablesArea = 0;

    if (surface.elements) {
        elementsArea = sumAreas(surface.elements);
    }

    if (surface.gables) {
        gablesArea = sum(surface.gables.map((gable) => triangleArea(surface.height - gable.roofBase, gable.roofAngle)));
    }

    return sumAreas([surface]) - elementsArea - gablesArea;
};

export const calculateSurfaceUValue = (composition: Fabric | FabricComponent[]) =>
    Array.isArray(composition) ? calculateUValue(composition) : composition.uValue;
