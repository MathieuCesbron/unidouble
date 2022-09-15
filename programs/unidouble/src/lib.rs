use anchor_lang::prelude::*;

declare_id!("C4TX181DDiFWoshCY3S8yMu6agRnz3cov2tQ87XsdimJ");

#[program]
pub mod unidouble {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let store = &mut ctx.accounts.store;
        store.creator = *ctx.accounts.user.key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        // 8 + 32 * 20 + 32
        space = 680,
        seeds = [user.key().as_ref()],
        bump,
    )]
    pub store: Account<'info, Store>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Store {
    // 32 countries with 20 categories each
    // 255 articles per categories
    // total number of articles: 32 * 20 * 255 = 163200
    pub info: [[u8; 32]; 20],
    pub creator: Pubkey,
}
