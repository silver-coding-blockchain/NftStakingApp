"use client";
import type { AppProps } from "next/app";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {  PhantomWalletAdapter, } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {endpoint} from "../api/utils/constants";
import "@solana/wallet-adapter-react-ui/styles.css";
import styles from "../styles/Home.module.css";
//import AirdropProvider from "./pageairdrop";
import NftStaking from "./pagenft"



function MyApp(){
    const phantomWallet= new PhantomWalletAdapter();
    
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[phantomWallet]} autoConnect>
                <WalletModalProvider>
                    <div className={styles.container}>
                        <div className={styles.navbar}>{<WalletMultiButton />}</div>
                        <div className={styles.main}>
                            <h1 className={styles.title}>
                                NFT STAKE
                                <NftStaking/>
                            </h1>
                        </div>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
};

export default MyApp;