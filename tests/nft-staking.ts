import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftStaking } from "../target/types/nft_staking";
import { assert } from "chai";

describe("nft-staking", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider=anchor.AnchorProvider.env();
  const program = anchor.workspace.NftStaking as Program<NftStaking>;

  
  it("Can create a message",async()=>{
    const message=anchor.web3.Keypair.generate();
    const messageContent="Hello World!";
    const txHash=await program.methods.createMessage(messageContent).accounts({
        message:message.publicKey,
        author: provider.wallet.publicKey,
        system_program: anchor.web3.SystemProgram.programId,
    }).signers([message]).rpc();

    provider.connection.confirmTransaction(txHash);
    
    const messageAccount = await program.account.message.fetch(message.publicKey);
    assert.equal(messageAccount.author.toBase58(), provider.wallet.publicKey.toBase58());
    assert.equal(messageAccount.content, messageContent);
    assert.ok(messageAccount.timestamp);
  })
});
