use anchor_lang::prelude::*;

declare_id!("644vqVe3YkkDsmb7tGkstkJ1HxG31tYN1KQEXsDv1tWW");

#[program]

pub mod nft_staking {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>)->Result<()>{
        Ok(())
    }
    pub fn create_message(ctx:Context<CreateMessage>,content:String)->Result<()>{
        let message:&mut Account<Message>=&mut ctx.accounts.message;
        let author:&Signer=&ctx.accounts.author;
        let clock:Clock=Clock::get().unwrap();

        message.author=*author.key;
        message.timestamp=clock.unix_timestamp;
        message.content=content;

        Ok(())
    }

    pub fn update_message(ctx:Context<UpdateMessage>,content:String)->Result<()>{
        let message:&mut Account<Message>=&mut ctx.accounts.message;
        let author:&Signer=&ctx.accounts.author;
        let clock:Clock=Clock::get().unwrap();

        message.author=*author.key;
        message.timestamp=clock.unix_timestamp;
        message.content=content;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize{}

#[account]
pub struct Message{
    pub author: Pubkey,
    pub timestamp: i64,
    pub content: String,
}

#[derive(Accounts)]
pub struct CreateMessage<'info>{
    #[account(init, payer=author, space=1000)]
    pub message: Account<'info, Message>,
    #[account(mut)]
    pub author:Signer<'info>,
    pub system_program:Program<'info,System>,
}

#[derive(Accounts)]
pub struct UpdateMessage<'info>{
    #[account(mut)]
    pub message: Account<'info, Message>,
    #[account(mut)]
    pub author:Signer<'info>,
}

