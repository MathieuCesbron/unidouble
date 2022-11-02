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

    #[msg("The country should be between 0 and 15")]
    InvalidCountry,

    #[msg("The category should be between 0 and 31")]
    InvalidCategory,

    #[msg("The price should be between 100 000 and 100 000 000 000 000 lamports")]
    InvalidPrice,

    #[msg("The title should be between 10 and 75 chars")]
    InvalidTitle,

    #[msg("The description should be between 50 and 750 chars")]
    InvalidDescription,

    #[msg("The image URL should be between 10 and 50 chars")]
    InvalidImageURL,

    #[msg("The category is already full")]
    InvalidCategoryFull,

    #[msg("The public key of the seller account should be the same as the transaction signer")]
    InvalidSellerAccount,

    #[msg("The store creator of the store should be the same as the store creator of the article")]
    InvalidStoreCreator,

    #[msg("The quantity should be equal or less to the stock of the article")]
    InvalidQuantity,

    #[msg("The delivery address cipher text should be between 32 and 160 chars, the delivery address should be between 10 and 75 chars")]
    InvalidDeliveryAddress,

    #[msg("The article has already the max amount of 27 buyers that needs to review")]
    TooMuchReviewers,

    #[msg("The rating should be between 0 and 5")]
    InvalidRating,

    #[msg("The user is not allowed to review")]
    InvalidReviewer,
}
