// This code defines an enum for the errors that can occur in the minting contract.
use casper_types::ApiError;

/// An enum for the errors that can occur in the minting contract.
#[derive(Debug)]
#[repr(u16)]
pub enum Error {
    PermissionDenied = 1,
    WrongArguments = 2,
    AdminNotSet = 3,
    InvalidContext=4
}

impl From<Error> for ApiError {
    /// Converts an `Error` to an `ApiError`.
    fn from(error: Error) -> ApiError {
        ApiError::User(error as u16)
    }
}
