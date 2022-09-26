export interface Rect {
    width: number;
    height: number;
}

export const sumAreas = (rects: Rect[]): number => rects.reduce((sum, rect) => sum + rect.width * rect.height, 0);
