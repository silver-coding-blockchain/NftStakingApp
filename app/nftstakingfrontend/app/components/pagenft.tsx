"use client";
import { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, web3,  AnchorProvider } from '@project-serum/anchor';

import { connection, commitmentLevel, nftStakingProgramId, nftStakingProgramInterface } from "../api/utils/constants";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { NftStaking } from '../api/types/nft_staking';
import { PublicKey, SystemProgram } from '@solana/web3.js';



export default function NftStakingApp(){
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [nftMint, setNftMint] = useState<string>('');
  const [stakingAccount, setStakingAccount] = useState<string>('');
  const [stakingData, setStakingData] = useState<any>(null);
  const [reward, setReward] = useState<number>(0);

  // useEffect(() => {
  //   if (wallet) {
  //     loadStakingData();
  //   }
  // }, [wallet]);

  // const loadStakingData = async () => {
  //   const program = await getProgram();
  //   const [stakingAccount] = await PublicKey.findProgramAddress(
  //     [Buffer.from('staking_account')],
  //     program.programId
  //   );

  //   try {
  //     const stakingData = await program.account.staking_account.fetch(stakingAccount);
  //     setStakingData(stakingData);
  //     const stakeAt=stakingData.stakedAt.toNumber();
  //     calculateReward(stakeAt);
  //   } catch (error) {
  //     console.error('Error fetching staking data:', error);
  //   }
  // };

  const calculateReward = (stakedAt: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const duration = currentTime - stakedAt;
    const reward = calculateRewardAmount(duration);
    setReward(reward);
  };

  const calculateRewardAmount = (duration: number): number => {
    const MAX_STAKING_DURATION = 30 * 24 * 60 * 60; // 30 days
    const STAKING_REWARD_RATE = 0.01; // 1% reward per day

    const maxDuration = Math.min(duration, MAX_STAKING_DURATION);
    const rewardRate = (maxDuration / MAX_STAKING_DURATION) * STAKING_REWARD_RATE;
    const rewardAmount = rewardRate * 1_000_000; // Convert to lamports

    return Math.floor(rewardAmount);
  };

  const handleStake = async () => {
    const program = await getProgram();

    try {
      const tx = await program.methods
        .stake(new PublicKey(nftMint))
        .accounts({
          stakingAccount,
          payer: wallet?.publicKey,
          SystemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      console.log('Stake transaction:', tx);
      //loadStakingData();
    } catch (error) {
      console.error('Error staking NFT:', error);
    }
  };

  const handleUnstake = async () => {
    const program = await getProgram();
    const [stakingAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('staking_account')],
      program.programId
    );

    try {
      const tx = await program.methods
        .unstake()
        .accounts({
          stakingAccount,
          payer: wallet?.publicKey,
        })
        .rpc();
      console.log('Unstake transaction:', tx);
      //loadStakingData();
      setReward(0);
    } catch (error) {
      console.error('Error unstaking NFT:', error);
    }
  };

  const handleClaimReward = async () => {
    const program = await getProgram();
    const [stakingAccount] = await PublicKey.findProgramAddress(
      [Buffer.from('staking_account')],
      program.programId
    );

    try {
      const tx = await program.methods
        .claimReward()
        .accounts({
          stakingAccount,
          payer: wallet?.publicKey,
        })
        .rpc();
      console.log('Claim reward transaction:', tx);
      //loadStakingData();
      setReward(0);
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const getProgram = (): Program<NftStaking> => {
    if (!wallet) throw new Error('Wallet not connected');
    const provider = new AnchorProvider(connection, wallet, {preflightCommitment:commitmentLevel,});
    const program = new Program(nftStakingProgramInterface, nftStakingProgramId,provider) as Program<NftStaking>;
    return program;
  };

  return (
    
      <div>
        <input
          type="text"
          value={nftMint}
          onChange={(e) => setNftMint(e.target.value)}
          placeholder="Enter NFT mint address"
        />
        <input
          type="text"
          value={stakingAccount}
          onChange={(e) => setStakingAccount(e.target.value)}
          placeholder="Enter Staking address"
        />
        <button onClick={handleStake}>Stake</button>
        {stakingData && (
          <div>
            <p>Staked Address: {stakingAccount.toString()}</p>
            <p>Staked NFT: {stakingData.nftMint.toString()}</p>
            <p>Staked at: {new Date(stakingData.stakedAt * 1000).toLocaleString()}</p>
            <p>Reward: {reward} lamports</p>
            <button onClick={handleUnstake}>Unstake</button>
            <button onClick={handleClaimReward}>Claim Reward</button>
          </div>
        )}
      </div>
    
  );
};


