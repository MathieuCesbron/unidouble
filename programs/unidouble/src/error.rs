use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid instruction")]
    InvalidInstruction,

    #[msg("The body of your email is too long. The max is 512 chars")]
    InvalidBody,

    #[msg("The subject of your email is too long. The max is 40 chars")]
    InvalidSubject,

    #[msg("The salt should be exactly 16 chars")]
    InvalidSalt,

    #[msg("The IV should be exactly 32 chars")]
    InvalidIv,

    #[msg("The diffie publickey should be exactly 64 chars")]
    InvalidDiffie,

    #[msg("The uuid should be exactly 6 chars")]
    InvalidUUID,

    #[msg("The title should be between 10 and 75 chars")]
    InvalidTitle,

    #[msg("The description should be between 50 and 750 chars")]
    InvalidDescription,

    #[msg("The image URL should be between 10 and 50 chars")]
    InvalidImageURL,

    #[msg("The category is already full")]
    InvalidCategory,

    #[msg("The public key of the seller account should be the same as the transaction signer")]
    InvalidSellerAccount,
}
