use casper_types::{Key, U256};
use contract_utils::{ContractStorage, ContractContext};

use crate::data;
use crate::error::Error;
pub trait MINTER<Storage: ContractStorage>: ContractContext<Storage> {
    fn init (
        &self, 
        admin: Key, 
        fund_manager: Key, 
        cep78_package_hash: Key,
        mint_fee:U256,
    )  {
        data::set_admin(admin);
        data::set_fund_manager(fund_manager);
        data::set_cep78_package_hash(cep78_package_hash);
        data::set_mint_fee(mint_fee);
    }

    fn update_admin(&self,  admin: Key) -> Result<(), Error>{
        if self.get_caller() != data::get_admin(){
            return Err(Error::PermissionDenied)
        }
        data::set_admin(admin);
        Ok(())
    }
}