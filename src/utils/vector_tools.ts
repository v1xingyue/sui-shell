export const TryDecodeString = (d: any) => {
    const tmp = new Uint8Array(d);    
    return new TextDecoder().decode(tmp);
};

export const BytesToHex = (d: Uint8Array | undefined) => {
    if(!d) return "";
    // @ts-ignore
    return d.toString("hex");
};

