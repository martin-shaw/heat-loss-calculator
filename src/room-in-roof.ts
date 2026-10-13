/**
 * Room-in-roof areas. Heat loss for Bedroom 3 is not switched onto these areas:
 * its stored pitch and rise do not close the wall, so the survey geometry has to
 * be settled before the roof surface changes.
 * See: docs/MODELS.md#room-in-roof
 */

export interface RoomInRoofGeometry {
    /** Plan length along the ridge (m). */
    length: number;
    /** Plan span between the eaves (m). */
    span: number;
    /** Vertical knee or stud wall height (m). Zero when the slope starts at floor level. */
    kneeWallHeight: number;
    /** Roof pitch from horizontal (degrees). */
    pitchDegrees: number;
    /** Flat-ceiling width measured across the span (m). Zero when the slopes meet at the ridge. */
    flatCeilingWidth: number;
}

const radians = (degrees: number) => (degrees * Math.PI) / 180;

const slopeRun = (geometry: RoomInRoofGeometry) => (geometry.span - geometry.flatCeilingWidth) / 2;

/** Rise of the sloping portion, from the top of the knee wall to the flat ceiling or ridge. */
export const slopeRise = (geometry: RoomInRoofGeometry) => slopeRun(geometry) * Math.tan(radians(geometry.pitchDegrees));

export const flatCeilingArea = (geometry: RoomInRoofGeometry) => geometry.flatCeilingWidth * geometry.length;

/**
 * Both sloping ceilings, along the rafter.
 * Horizontal run is divided by cos(pitch), which is the RdSAP rafter-line area increase.
 */
export const slopingCeilingArea = (geometry: RoomInRoofGeometry) => {
    const slopeLength = slopeRun(geometry) / Math.cos(radians(geometry.pitchDegrees));
    return 2 * slopeLength * geometry.length;
};

/** Both eaves knee walls. */
export const kneeWallArea = (geometry: RoomInRoofGeometry) => 2 * geometry.kneeWallHeight * geometry.length;

/**
 * One gable end: rectangle up to the knee, plus the trapezoid (or triangle, if there is no flat ceiling)
 * up to the ridge.
 */
export const gableEndArea = (geometry: RoomInRoofGeometry) => {
    const rise = slopeRise(geometry);
    const aboveKnee = ((geometry.span + geometry.flatCeilingWidth) / 2) * rise;
    return geometry.span * geometry.kneeWallHeight + aboveKnee;
};
