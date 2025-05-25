export const scientificNotation = (n: number, decimals: number = 2) => {
    if(n === 0) {
        return "0";
    }
    const abs = Math.abs(n);
    const exp = Math.floor(Math.log10(abs));
    const mant = n / Math.pow(10, exp);
    let mantText = mant.toFixed(decimals);
    for(let i = mantText.length - 1; i >= 0; i--) {
        if(mantText[i] === "0") {
            mantText = mantText.slice(0, i);
        } else {
            if(mantText[i] === ".") {
                mantText = mantText.slice(0, i);
            }
            break;
        }
    }
    return mantText + ((abs >= 1 && abs < 10) ? "" : ("e" + exp));
};