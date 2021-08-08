export type Coords<X = number, Y = number> = [X, Y];
export const nullCoords: Coords = [-1, -1];

export const createCoords = (x: number, y: number): Coords => {
  return [x, y];
};

export const checkCoords = (coords: Coords) => ({
  areEquals: (anotherCoords: Coords) => {
    const [x, y] = coords;
    const [x1, y1] = anotherCoords;

    return x === x1 && y === y1;
  },
  toBeIn: (list: Coords[]) => {
    return list.some(checkCoords(coords).areEquals);
  },
});

export type MoveSnapshot = {
  from: Coords;
  to: Coords;
};
