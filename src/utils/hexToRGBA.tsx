const hexToRGB = (hex: string) => {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
};

export const hexToRGBA = (hex: string, a: number) => {
    const {r, g, b} = hexToRGB(hex);
    return `rgba(${r}, ${g}, ${b}, ${a})`
};