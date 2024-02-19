import { sumAreas } from "./rect";
import { Room, RoomInRoof } from "./room";
import { GableWall, Surface, calculateUValue } from "./surface";
import { defaultRoomTemperature } from "./settings";
import { Fabric, FabricComponent } from "./fabric";
import { sum } from "./math";

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

export const calculateRoomInRoof = (room: RoomInRoof): CalculatedRoom => {
    // const surfaces = room.surfaces.map((surface) => calculateSurface(surface, room.temperature));
    // const gableWalls = room.gableWalls.map((gableWall) => calculateSurface(gableWall, room.temperature));

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

    const calculatedGableWalls = room.gableWalls.map((surface) => {
        const surfaceAreas = calculateSurfaceAreas(surface);

        // Remove roof triangle part from surface area

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

/*
export const calculateSurface = (surface: Surface) => {
    const surfaces = [surface, ...(surface.elements ? surface.elements : [])];

    const calculatedSurfaces = surfaces.map((surface) => calculateSurfaceArea(surface));

    return {
        name: surface.name,
        boundaryTemperature: surface.boundaryTemperature,
        composition: surface.composition,
        area: sum(calculatedSurfaces),
    };
};
*/

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

    if (surface.elements) {
        elementsArea = sumAreas(surface.elements);
    }

    return sumAreas([surface]) - elementsArea;
};

export const calculateGableWallSurfaceArea = (surface: GableWall) => {
    let elementsArea = 0;

    if (surface.elements) {
        elementsArea = sumAreas(surface.elements);
    }

    return sumAreas([surface]) - elementsArea;
};

export const calculateSurfaceUValue = (composition: Fabric | FabricComponent[]) =>
    Array.isArray(composition) ? calculateUValue(composition) : composition.uValue;
