

import idl from "../idl/nft_staking.json";
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export const commitmentLevel="processed";
export const endpoint = clusterApiUrl("devnet");
export const connection = new Connection(endpoint, commitmentLevel);

export const nftStakingProgramId = new PublicKey(idl.address);
export const nftStakingProgramInterface = JSON.parse(JSON.stringify(idl));
