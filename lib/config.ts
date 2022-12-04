import { Contract } from "ethers";
import { RotationProvider } from "./helpers/rotationProvider";
import LensHubABI from "./abis/lensHubImplementation.json";

export const PROFILE_ID = 10859;

const polygonProviders = [
  "https://polygon-rpc.com",
  "https://polygon-mainnet.public.blastapi.io",
  "https://rpc-mainnet.matic.quiknode.pro",
];

export const IPFS_GATEWAY = "https://lens.infura-ipfs.io/ipfs/";

export const polygonProvider = new RotationProvider(polygonProviders, 137);

// Deployment block of LensHubProxy
export const STARTING_BLOCK = 28384641;
// Max number of blocks per queryFilter, rpc limit
export const BLOCK_LIMIT = 10000;
const lensHubProxyAddress = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export const lensHubProxyContract = new Contract(
  lensHubProxyAddress,
  LensHubABI,
  polygonProvider
);
