use casper_types::{Key, URef, U256, U512};
use casper_contract::{contract_api::system, unwrap_or_revert::UnwrapOrRevert};

use crate::cep18_utils;
use crate::cep78_utils;
use crate::data::{self, Whitelist};
use crate::error::Error;

pub fn only_admin(caller: Key) -> Result<(), Error> {
    if caller != data::get_admin() {
        return Err(Error::PermissionDenied);
    }
    Ok(())
}

pub fn mint_allowed() -> Result<(), Error> {
    if !data::get_allow_mint() {
        return Err(Error::MintNotAllowed);
    }
    Ok(())
}

pub fn limited_mint(nft_owner: Key, count: u64) -> Result<(), Error> {
    let mut owner_holding = cep78_utils::balance_of(nft_owner);
    owner_holding += count;
    if owner_holding > 20 {
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

pub fn enough_native_balance(amount: U512, purse: URef) -> Result<(), Error> {
    let balance = system::get_purse_balance(purse).unwrap_or_revert_with(Error::UableToReadPurse);
    if amount > balance {
        return Err(Error::NotEnoughBalance);
    }
    Ok(())
}

pub fn enough_cep18_balance(amount: U256, address: Key, cep18_package_hash: Key) -> Result<(), Error> {
    let balance = cep18_utils::balance_of(address, cep18_package_hash);
    if amount > balance {
        return Err(Error::NotEnoughBalance);
    }
    Ok(())
}