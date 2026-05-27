use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{
        create_metadata_accounts_v3, CreateMetadataAccountsV3,
        mpl_token_metadata::types::DataV2,
    },
    token::{mint_to, MintTo, Token, TokenAccount},
    associated_token::AssociatedToken,
};
use anchor_spl::token_interface::Mint;

declare_id!("Launchly111111111111111111111111111111111111111");

/// The TokenFactory program — creates SPL tokens with metadata.
#[program]
pub mod token_factory {
    use super::*;

    /// Create a new SPL token with metadata.
    ///
    /// Parameters are limited by transaction size (~1200 bytes total for compute).
    pub fn create_token(
        ctx: Context<CreateToken>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
        initial_supply: u64,
    ) -> Result<()> {
        // ---- 1. Mint initial supply to creator's ATA ----
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.creator_token_account.to_account_info(),
            authority: ctx.accounts.creator.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // mint the initial supply (already adjusted for decimals in the client)
        mint_to(cpi_ctx, initial_supply)?;

        // ---- 2. Create on-chain metadata (Metaplex) ----
        let data = DataV2 {
            name: name.clone(),
            symbol: symbol.clone(),
            uri: uri.clone(),
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        let cpi_accounts = CreateMetadataAccountsV3 {
            metadata: ctx.accounts.metadata.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            mint_authority: ctx.accounts.creator.to_account_info(),
            update_authority: ctx.accounts.creator.to_account_info(),
            payer: ctx.accounts.creator.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_metadata_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        create_metadata_accounts_v3(
            cpi_ctx,
            data,
            false,  // is_mutable
            true,   // update_authority_is_signer
            None,   // collection_details
        )?;

        // ---- 3. Store creation record ----
        let record = &mut ctx.accounts.creation_record;
        record.creator = ctx.accounts.creator.key();
        record.mint = ctx.accounts.mint.key();
        record.name = name;
        record.symbol = symbol;
        record.decimals = decimals;
        record.initial_supply = initial_supply;
        record.timestamp = Clock::get()?.unix_timestamp;

        emit!(TokenCreated {
            creator: record.creator,
            mint: record.mint,
            name: record.name.clone(),
            symbol: record.symbol.clone(),
            decimals,
            initial_supply,
        });

        Ok(())
    }
}

/* ------------------------------------------------------------------ */
/*  Accounts                                                           */
/* ------------------------------------------------------------------ */

#[derive(Accounts)]
pub struct CreateToken<'info> {
    /// The creator who pays for account rent and signs.
    #[account(mut)]
    pub creator: Signer<'info>,

    /// The new mint account (created by the client, must be a signer).
    #[account(
        mut,
        constraint = mint.is_signer,
        constraint = mint.decimals == 0 @ErrorCode::NotInitialized,
    )]
    pub mint: Account<'info, Mint>,

    /// The creator's associated token account for the new mint.
    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = creator,
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    /// Metaplex metadata PDA: ["metadata", mint]
    /// CHECK: created by `create_metadata_accounts_v3`
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// Creation record PDA: ["record", mint]
    #[account(
        init,
        payer = creator,
        space = 8 + CreationRecord::MAX_SIZE,
        seeds = [b"record", mint.key().as_ref()],
        bump,
    )]
    pub creation_record: Account<'info, CreationRecord>,

    /// CHECK: Metaplex Token Metadata program
    #[account(address = mpl_token_metadata::ID)]
    pub token_metadata_program: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */

#[account]
pub struct CreationRecord {
    pub creator: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub initial_supply: u64,
    pub timestamp: i64,
}

impl CreationRecord {
    // 32 + 32 + (4+32) + (4+8) + 1 + 8 + 8 + discriminator(8)
    pub const MAX_SIZE: usize = 32 + 32 + 36 + 12 + 1 + 8 + 8 + 8;
}

/* ------------------------------------------------------------------ */
/*  Events                                                             */
/* ------------------------------------------------------------------ */

#[event]
pub struct TokenCreated {
    pub creator: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub initial_supply: u64,
}

/* ------------------------------------------------------------------ */
/*  Errors                                                             */
/* ------------------------------------------------------------------ */

#[error_code]
pub enum ErrorCode {
    #[msg("Mint account is not signed")]
    NotSigned,
    #[msg("Mint not properly initialized")]
    NotInitialized,
}
