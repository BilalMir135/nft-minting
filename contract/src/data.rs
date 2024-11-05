use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::{Key, U256};
use contract_utils::{set_key, get_key};

pub const NAMED_KEY_ADMIN: &str = "admin";
pub const NAMED_KEY_FUND_MANAGER: &str = "fund_manager";
pub const NAMED_KEY_MINT_FEE: &str = "mint_fee";
pub const NAMED_KEY_CEP78_PACKAGE_HASH: &str = "cep78_package_hash";

pub const NAMED_KEY_MINTER_CONTRACT_HASH: &str = "minter_contract_hash";
pub const NAMED_KEY_MINTER_CONTRACT_PACKAGE_HASH: &str = "minter_contract_package_hash";

pub fn set_admin(admin:Key) {
    set_key(NAMED_KEY_ADMIN, admin);
}

pub fn get_admin() -> Key {
    get_key(NAMED_KEY_ADMIN).unwrap_or_revert()
}

pub fn set_fund_manager(fund_manager:Key) {
    set_key(NAMED_KEY_FUND_MANAGER, fund_manager);
}

pub fn get_fund_manager() -> Key {
    get_key(NAMED_KEY_FUND_MANAGER).unwrap_or_revert()
}

pub fn set_mint_fee(mint_fee:U256) {
    set_key(NAMED_KEY_MINT_FEE, mint_fee);
}

pub fn get_mint_fee() -> U256 {
    get_key(NAMED_KEY_MINT_FEE).unwrap_or_revert()
}

pub fn set_cep78_package_hash(cep78_package_hash:Key) {
    set_key(NAMED_KEY_CEP78_PACKAGE_HASH, cep78_package_hash);
}

pub fn get_cep78_package_hash() -> Key {
    get_key(NAMED_KEY_CEP78_PACKAGE_HASH).unwrap_or_revert()
}

pub fn set_temp(admin:Key) {
    set_key("temp", admin);
}

pub fn log_state(name: &str, value: &str) {
    set_key(name, value);
}
