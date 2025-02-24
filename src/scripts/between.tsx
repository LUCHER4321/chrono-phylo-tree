export const between = (n: number, min: number, max: number) => {
    return n < min ? min : n > max ? max : n;
};