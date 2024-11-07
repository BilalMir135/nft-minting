use casper_types::Key;

use crate::cep78_utils;
use crate::data::{self, Whitelist};
use crate::error::Error;

pub fn only_admin(caller: Key) -> Result<(), Error> {
    if caller != data::get_admin() {
        return Err(Error::PermissionDenied);
    }
    Ok(())
}

pub fn limited_mint(nft_owner: Key, count: u64) -> Result<(), Error> {
    let mut owner_holding = cep78_utils::balance_of(nft_owner);
    owner_holding += count;
    if owner_holding >= 5 {
        return Err(Error::MintLimitExceed);
    }
    Ok(())
}

pub fn valid_account(account: Key) -> Result<(), Error> {
    if data::get_only_whitelist() {
        let whitelist = Whitelist::instance();
        if !whitelist.get(&account) {
            return Err(Error::NotWhitelisted);
        }
    }
    Ok(())
}