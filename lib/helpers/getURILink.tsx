import { IPFS_GATEWAY } from "../config";

/**
 *
 * @param hash - IPFS hash
 * @returns IPFS link
 */
export const getURILink = (hash: string): string => {
    if (!hash) {
        return '';
    }
    const gateway = IPFS_GATEWAY;
    return hash
        .replace(/^Qm[1-9A-Za-z]{44}/gm, `${gateway}${hash}`)
        .replace('https://ipfs.io/ipfs/', gateway)
        .replace('https://ipfs.infura.io/ipfs/', gateway)
        .replace('ipfs://', gateway);
};
