use crate::error::ErrorCode;
use anchor_lang::prelude::*;
pub mod error;

declare_id!("C4TX181DDiFWoshCY3S8yMu6agRnz3cov2tQ87XsdimJ");

#[program]
pub mod unidouble {
    use super::*;

    pub fn initialize_store(ctx: Context<InitializeStore>) -> Result<()> {
        let store = &mut ctx.accounts.store;
        store.creator = *ctx.accounts.user.key;
        Ok(())
    }

    pub fn create_seller_account(
        ctx: Context<CreateSellerAccount>,
        diffie_public_key: String,
    ) -> Result<()> {
        require!(
            diffie_public_key.chars().count() == 64,
            ErrorCode::InvalidDiffie
        );
        let seller_account = &mut ctx.accounts.seller_account;

        seller_account.store_creator_public_key = ctx.accounts.store.creator.key();
        seller_account.diffie_public_key = diffie_public_key;
        seller_account.seller_public_key = ctx.accounts.user.key();
        Ok(())
    }

    pub fn initialize_article(
        ctx: Context<InitializeArticle>,
        uuid: String,
        country: u8,
        category: u8,
    ) -> Result<()> {
        require!(uuid.chars().count() == 6, ErrorCode::InvalidUUID);
        require!(country < 32, ErrorCode::InvalidCountry);
        require!(category < 16, ErrorCode::InvalidCategory);
        require!(
            ctx.accounts.user.key() == ctx.accounts.seller_account.seller_public_key,
            ErrorCode::InvalidSellerAccount
        );

        let store = &mut ctx.accounts.store;
        let total_articles: u8 = store.info[country as usize][category as usize];
        require!(total_articles < 255, ErrorCode::InvalidCategoryFull);

        store.info[country as usize][category as usize] += 1;

        let article = &mut ctx.accounts.article;

        article.seller_account_public_key = ctx.accounts.user.key();
        article.store_creator_public_key = ctx.accounts.store.creator.key();
        article.uuid = uuid;
        article.country = country;
        article.category = category;
        Ok(())
    }

    pub fn post_article(
        ctx: Context<PostArticle>,
        price: u64,
        quantity: u16,
        title: String,
        description: String,
        image_url: String,
    ) -> Result<()> {
        require!(
            10 <= title.chars().count() && title.chars().count() <= 75,
            ErrorCode::InvalidTitle
        );
        require!(
            50 <= description.chars().count() && description.chars().count() <= 750,
            ErrorCode::InvalidDescription
        );
        require!(
            10 <= image_url.chars().count() && image_url.chars().count() <= 50,
            ErrorCode::InvalidImageURL
        );
        require!(
            ctx.accounts.user.key() == ctx.accounts.article.seller_account_public_key,
            ErrorCode::InvalidSellerAccount
        );
        let article = &mut ctx.accounts.article;

        article.price = price;
        article.quantity = quantity;

        article.title = title;
        article.description = description;
        article.image_url = image_url;
        Ok(())
    }

    pub fn update_article(
        ctx: Context<UpdateArticle>,
        quantity: u16,
        title: String,
        description: String,
        image_url: String,
    ) -> Result<()> {
        require!(
            ctx.accounts.user.key() == ctx.accounts.article.seller_account_public_key,
            ErrorCode::InvalidSellerAccount
        );

        let article = &mut ctx.accounts.article;

        if quantity != 0 {
            article.quantity = quantity;
        }

        if title.chars().count() != 0 {
            require!(
                10 <= title.chars().count() && title.chars().count() <= 75,
                ErrorCode::InvalidTitle
            );
            article.title = title;
        }

        if description.chars().count() != 0 {
            require!(
                50 <= description.chars().count() && description.chars().count() <= 750,
                ErrorCode::InvalidDescription
            );
            article.description = description;
        }

        if image_url.chars().count() != 0 {
            require!(
                10 <= image_url.chars().count() && image_url.chars().count() <= 50,
                ErrorCode::InvalidImageURL
            );
            article.image_url = image_url;
        }
        Ok(())
    }

    pub fn remove_article(ctx: Context<RemoveArticle>) -> Result<()> {
        require!(
            ctx.accounts.user.key() == ctx.accounts.article.seller_account_public_key,
            ErrorCode::InvalidSellerAccount
        );
        require!(
            ctx.accounts.store.creator == ctx.accounts.article.store_creator_public_key,
            ErrorCode::InvalidStoreCreator
        );

        let store = &mut ctx.accounts.store;
        let country = ctx.accounts.article.country;
        let category = ctx.accounts.article.category;
        msg!("{:?}", store.info);
        store.info[country as usize][category as usize] -= 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeStore<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        // 8 + 512 + 32
        space = 552,
        seeds = [user.key().as_ref()],
        bump,
    )]
    pub store: Account<'info, Store>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateSellerAccount<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer=user,
        // 8 + 68 + 64
        space = 140,
        seeds = [user.key().as_ref()],
        bump,
    )]
    pub seller_account: Account<'info, SellerAccount>,
    pub store: Account<'info, Store>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(uuid:String)]
pub struct InitializeArticle<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer=user,
        space=10240,
        seeds = [uuid.as_ref()],
        bump,
    )]
    pub article: Account<'info, Article>,
    pub seller_account: Account<'info, SellerAccount>,
    #[account(mut)]
    pub store: Account<'info, Store>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PostArticle<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub article: Account<'info, Article>,
}

#[derive(Accounts)]
pub struct UpdateArticle<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub article: Account<'info, Article>,
}

#[derive(Accounts)]
pub struct RemoveArticle<'info> {
    #[account(mut)]
    user: Signer<'info>,
    #[account(mut, close = user)]
    article: Account<'info, Article>,
    #[account(mut)]
    pub store: Account<'info, Store>,
}

#[account]
pub struct Store {
    // 32 countries with 16 categories each
    // 255 articles per categories
    // total number of articles: 32 * 16 * 255 = 130560
    pub info: [[u8; 32]; 16], // +1*32*16=512
    pub creator: Pubkey,      // +32
}

#[account]
pub struct SellerAccount {
    seller_public_key: Pubkey,        // +32
    store_creator_public_key: Pubkey, // +32
    diffie_public_key: String,        // +68
}

#[account]
pub struct Article {
    pub seller_account_public_key: Pubkey, // +32
    pub store_creator_public_key: Pubkey,  // +32

    pub uuid: String, // +4+6=10
    pub country: u8,  // +1
    pub category: u8, // +1

    pub price: u64,    // +8
    pub quantity: u16, // +2

    pub title: String,       // 4+100=104
    pub description: String, // 4+1000=1004
    pub image_url: String,   // 4+100=104

    pub buyer_count: u16,  // +2
    pub rating_count: u16, // +2
    pub rating: f32,       // +4

    pub deliveries: Vec<String>, // +10*150=1500
    pub reviewers: Vec<Pubkey>,  // +10*32=320

    pub buyer_diffie_keys: Vec<String>, // 4+10*64=644
    pub buyer_salts: Vec<String>,       // 4+10*16=164
    pub buyer_ivs: Vec<String>,         // 4+10*32=324
}
