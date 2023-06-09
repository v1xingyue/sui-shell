export const TryDecodeString = (d: any) => {
    const tmp = new Uint8Array(d);    
    return new TextDecoder().decode(tmp);
};