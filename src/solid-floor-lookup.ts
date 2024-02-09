interface Model {
    area: number;
    exposedPerimiter: number;
}

const uValues = new Map<number, number>();
uValues.set(0.05, 0.13);
uValues.set(0.1, 0.22);
uValues.set(0.15, 0.3);
uValues.set(0.2, 0.37);
uValues.set(0.25, 0.44);
uValues.set(0.3, 0.49);
uValues.set(0.35, 0.55);
uValues.set(0.4, 0.6);
uValues.set(0.45, 0.65);
uValues.set(0.5, 0.7);

export const maxUValue = 0.7;

// https://www.gov.scot/binaries/content/documents/govscot/publications/advice-and-guidance/2020/02/tables-of-u-values-and-thermal-conductivity/documents/6-c---u-values-of-ground-floors-and-basements/6-c---u-values-of-ground-floors-and-basements/govscot%3Adocument/6.C%2B-%2BU-values%2Bof%2Bground%2Bfloors%2Band%2Bbasements%2B%2B.pdf
export const calculate = (model: Model) => {
    const { area, exposedPerimiter } = model;

    const perimeterToArea = exposedPerimiter / area;

    let key: number | undefined;
    const keys = uValues.keys();
    let result = keys.next();

    while (!result.done) {
        const value = result.value;

        const max = Math.max(perimeterToArea, value);

        if (max == value) {
            key = value;
            break;
        }

        result = keys.next();
    }

    return key ? uValues.get(key) : maxUValue;
};
