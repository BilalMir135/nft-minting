use casper_types::{
    contracts::Parameters,
    EntryPoint, EntryPoints, CLType, EntryPointAccess, EntryPointType
};

pub const ENTRY_POINT_INIT: &str = "init";
pub const ENTRY_POINT_MINT: &str = "mint";
pub const ENTRY_POINT_UPDATE_ADMIN: &str = "update_admin";
pub const ENTRY_POINT_UPDATE_FUND_MANAGER: &str = "update_fund_manager";

pub const NAMED_KEY_ADMIN: &str = "admin";
pub const NAMED_KEY_FUND_MANAGER: &str = "fund_manager";
pub const NAMED_KEY_MINT_PRICE: &str = "mint_price";
pub const NAMED_KEY_MINTER_CONTRACT_HASH: &str = "minter_contract_hash";
pub const NAMED_KEY_MINTER_CONTRACT_PACKAGE_HASH: &str = "minter_contract_package_hash";
pub const NAMED_KEY_CEP78_CONTRACT_PACKAGE_HASH: &str = "cep78_contract_package_hash";

pub const ARG_ADMIN: &str = "admin";
pub const ARG_FUND_MANAGER: &str = "fund_manager";
pub const ARG_MINT_PRICE: &str = "mint_price";
pub const ARG_CEP78_CONTRACT_PACKAGE_HASH: &str = "cep78_contract_package_hash";

pub fn get_entry_points() -> EntryPoints {
    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_INIT,
        Parameters::new(),
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_MINT,
        Parameters::new(),
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_UPDATE_ADMIN,
        Parameters::new(),
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_UPDATE_FUND_MANAGER,
        Parameters::new(),
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    entry_points
}
