/**
 * Room fabric heat loss: Q = U · A · ΔT (SAP-style).
 * Model: docs/MODELS.md#fabric-heat-loss
 */
import { sumAreas } from "./rect";
import { Room } from "./room";
import { Surface } from "./surface";
import { calculateUValue, Fabric, FabricComponent } from "./fabric";
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
    if (boundaryTemperature === undefined) {
        throw new Error(`Surface "${surface.name}" requires a boundaryTemperature`);
    }

    const deltaT = roomTemperature - boundaryTemperature;

    const uValue = calculateSurfaceUValue(surface.composition);
    // Q = U · A · ΔT — see docs/MODELS.md#fabric-heat-loss
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
