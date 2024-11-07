use alloc::vec::Vec;
use casper_types::{Key, U256};
use contract_utils::{ContractStorage, ContractContext};

use crate::cep78_utils;
use crate::data::{self, Whitelist};
use crate::error::Error;
use crate::modifiers;
pub trait MINTER<Storage: ContractStorage>: ContractContext<Storage> {
    fn init (
        &self, 
        admin: Key, 
        fund_manager: Key, 
        cep78_package_hash: Key,
        mint_fee:U256,
        only_whitelist: bool,
    )  {
        data::set_admin(admin);
        data::set_fund_manager(fund_manager);
        data::set_cep78_package_hash(cep78_package_hash);
        data::set_mint_fee(mint_fee);
        data::set_mint_count(0u64);
        data::set_only_whitelist(only_whitelist);
        Whitelist::init();
    }

    fn update_admin(&self,  admin: Key) -> Result<(), Error> {
        modifiers::only_admin(self.get_caller())?;
        data::set_admin(admin);
        Ok(())
    }

    fn mint_nft(&self,  nft_owner: Key, count: u64) -> Result<(), Error> {
        let mut mint_count = data::get_mint_count();
        for _ in 0..count {
            cep78_utils::mint(nft_owner, mint_count);
            mint_count += 1;
        }
        data::set_mint_count(mint_count);
        Ok(())
    }

    fn free_mint(&self,  nft_owner: Key, count: u64) -> Result<(), Error> {
        modifiers::only_admin(self.get_caller())?;
        self.mint_nft(nft_owner, count)?;
        Ok(())
    }

    fn public_mint(&self,  nft_owner: Key, count: u64) -> Result<(), Error> {
        modifiers::valid_account(nft_owner)?;
        modifiers::limited_mint(nft_owner, count)?;
        self.mint_nft(nft_owner, count)?;
        Ok(())
    }

    fn set_whitelist(&self, accounts: Vec<Key>, values: Vec<bool>) -> Result<(), Error> {
        modifiers::only_admin(self.get_caller())?;
        let whitelist = Whitelist::instance();
        for (key, &value) in accounts.iter().zip(values.iter()) {
            whitelist.set(key, value);
        }
        Ok(())
    }

    fn reset_whitelist(&self, accounts: Vec<Key>, values: Vec<bool>) -> Result<(), Error> {
        modifiers::only_admin(self.get_caller())?;
        Whitelist::reset();
        self.set_whitelist(accounts, values)?;
        Ok(())
    }
}