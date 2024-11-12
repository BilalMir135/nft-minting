#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

extern crate alloc;
use alloc::{
    boxed::Box, 
    vec, 
    vec::Vec, 
    collections::BTreeSet, 
    format, 
    string::{String, ToString}
};

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    runtime_args, CLType, CLValue, 
    ContractPackageHash, EntryPoint, EntryPointAccess, 
    EntryPointType, EntryPoints, 
    Group, Key, Parameter, RuntimeArgs, URef, U256
};
use contract_utils::{ContractContext, OnChainContractStorage};

use contract::minter::MINTER;
use contract::utils;

#[derive(Default)]
struct Minter(OnChainContractStorage);

impl ContractContext<OnChainContractStorage> for Minter {
    fn storage(&self) -> &OnChainContractStorage {
        &self.0
    }
}

impl MINTER<OnChainContractStorage> for Minter {}

impl Minter {
    fn constructor(
        &self,
        admin: Key,
        fund_manager: Key,
        cep78_package_hash: Key,
        mint_fee: U256,
        only_whitelist: bool,
        allow_mint: bool
    ) {
        MINTER::init(
            self,
            admin,
            fund_manager,
            cep78_package_hash,
            mint_fee,
            only_whitelist,
            allow_mint
        )
    }
}

const CONSTRUCTOR_GROUP: &str = "constructor";

const ARG_ADMIN: &str = "admin";
const ARG_FUND_MANAGER: &str = "fund_manager";
const ARG_CEP78_PACKAGE_HASH: &str = "cep78_package_hash";
const ARG_MINT_FEE: &str = "mint_fee";
const ARG_ONLY_WHITELIST: &str = "only_whitelist";
const ARG_ALLOW_MINT: &str = "allow_mint";

const ARG_NFT_OWMER: &str = "nft_owner";
const ARG_COUNT: &str = "count";
const ARG_SOURCE_PURSE: &str = "source_purse";
const ARG_ALLOWER: &str = "allower";
const ARG_CEP18_PACKAGE_HASH: &str = "cep18_package_hash";

const ARG_WHITELIST_ACCOUNTS: &str = "whitelist_accounts";
const ARG_WHITELIST_VALUES: &str = "whitelist_values";

const ENTRY_POINT_CONSTRUCTOR: &str = "constructor";
const ENTRY_POINT_SET_CONFIG: &str = "set_config";
const ENTRY_POINT_FREE_MINT: &str = "free_mint";
const ENTRY_POINT_NATIVE_MINT: &str = "native_mint"; 
const ENTRY_POINT_CEP18_MINT: &str = "cep18_mint"; 
const ENTRY_POINT_SET_WHITELIST: &str = "set_whitelist";
const ENTRY_POINT_RESET_WHITELIST: &str = "reset_whitelist";
const ENTRY_POINT_GET_MINT_COST: &str = "get_mint_cost";

const NAMED_KEY_MINTER_CONTRACT_HASH: &str = "minter_contract_hash";
const NAMED_KEY_MINTER_CONTRACT_PACKAGE_HASH: &str = "minter_contract_package_hash";

#[no_mangle]
pub extern "C" fn constructor() {
    let admin = runtime::get_named_arg::<Key>(ARG_ADMIN);
    let fund_manager = runtime::get_named_arg::<Key>(ARG_FUND_MANAGER);
    let cep78_package_hash = runtime::get_named_arg::<Key>(ARG_CEP78_PACKAGE_HASH);
    let mint_fee = runtime::get_named_arg::<U256>(ARG_MINT_FEE);
    let only_whitelist = runtime::get_named_arg::<bool>(ARG_ONLY_WHITELIST);
    let allow_mint = runtime::get_named_arg::<bool>(ARG_ALLOW_MINT);

    Minter::default().constructor(
        admin, 
        fund_manager, 
        cep78_package_hash, 
        mint_fee,
        only_whitelist,
        allow_mint
    );
}

#[no_mangle]
pub extern "C" fn set_config() {
    let admin = utils::get_optional_named_arg::<Key>(ARG_ADMIN);
    let fund_manager = utils::get_optional_named_arg::<Key>(ARG_FUND_MANAGER);
    let mint_fee  = utils::get_optional_named_arg::<U256>(ARG_MINT_FEE);
    let only_whitelist = utils::get_optional_named_arg::<bool>(ARG_ONLY_WHITELIST);
    let allow_mint = utils::get_optional_named_arg::<bool>(ARG_ALLOW_MINT);

        Minter::default().set_config(
            admin,
            fund_manager,
            mint_fee,
            only_whitelist,
            allow_mint
        ).unwrap_or_revert();
}

#[no_mangle]
pub extern "C" fn free_mint() {
    let nft_owner = runtime::get_named_arg::<Key>(ARG_NFT_OWMER);
    let count = runtime::get_named_arg::<u64>(ARG_COUNT);
    Minter::default().free_mint(nft_owner, count).unwrap_or_revert();
}

#[no_mangle]
pub extern "C" fn set_whitelist() {
    let accounts = runtime::get_named_arg::<Vec<Key>>(ARG_WHITELIST_ACCOUNTS);
    let values = runtime::get_named_arg::<Vec<bool>>(ARG_WHITELIST_VALUES);
    Minter::default().set_whitelist(accounts, values).unwrap_or_revert();
}

#[no_mangle]
pub extern "C" fn native_mint() {
    let nft_owner = runtime::get_named_arg::<Key>(ARG_NFT_OWMER);
    let count = runtime::get_named_arg::<u64>(ARG_COUNT);
    let source_purse = runtime::get_named_arg::<URef>(ARG_SOURCE_PURSE);
    Minter::default().native_mint(nft_owner, count, source_purse).unwrap_or_revert();
}

#[no_mangle]
pub extern "C" fn cep18_mint() {
    let nft_owner = runtime::get_named_arg::<Key>(ARG_NFT_OWMER);
    let count = runtime::get_named_arg::<u64>(ARG_COUNT);
    let allower = runtime::get_named_arg::<Key>(ARG_ALLOWER);
    let cep18_package_hash = runtime::get_named_arg::<Key>(ARG_CEP18_PACKAGE_HASH);
    Minter::default().cep18_mint(nft_owner, count, allower, cep18_package_hash).unwrap_or_revert();
}

#[no_mangle]
pub extern "C" fn reset_whitelist() {
    let accounts = runtime::get_named_arg::<Vec<Key>>(ARG_WHITELIST_ACCOUNTS);
    let values = runtime::get_named_arg::<Vec<bool>>(ARG_WHITELIST_VALUES);
    Minter::default().reset_whitelist(accounts, values).unwrap_or_revert();
}

#[no_mangle]
pub extern "C" fn get_mint_cost() {
    let count = runtime::get_named_arg::<u64>(ARG_COUNT);
    let mint_cost = Minter::default().get_mint_cost(count);
    runtime::ret(CLValue::from_t(mint_cost).unwrap());
}

#[no_mangle]
pub extern "C" fn call() {
    let admin = runtime::get_named_arg::<Key>(ARG_ADMIN);
    let fund_manager = runtime::get_named_arg::<Key>(ARG_FUND_MANAGER);
    let cep78_package_hash = runtime::get_named_arg::<Key>(ARG_CEP78_PACKAGE_HASH);
    let mint_fee = runtime::get_named_arg::<U256>(ARG_MINT_FEE);
    let only_whitelist = runtime::get_named_arg::<bool>(ARG_ONLY_WHITELIST);
    let allow_mint = runtime::get_named_arg::<bool>(ARG_ALLOW_MINT);

    let (contract_hash, _) = storage::new_contract(
        get_entry_points(),
        None,
        Some(String::from(NAMED_KEY_MINTER_CONTRACT_PACKAGE_HASH)),
        None,
    );

    let package_hash: ContractPackageHash = ContractPackageHash::new(
        runtime::get_key(NAMED_KEY_MINTER_CONTRACT_PACKAGE_HASH)
            .unwrap_or_revert()
            .into_hash()
            .unwrap_or_revert(),
    );

    // let package_hash_key: Key = package_hash.into();

    let init_args = runtime_args! {
        ARG_ADMIN => admin,
        ARG_FUND_MANAGER => fund_manager,
        ARG_CEP78_PACKAGE_HASH => cep78_package_hash,
        ARG_MINT_FEE => mint_fee,
        ARG_ONLY_WHITELIST => only_whitelist,
        ARG_ALLOW_MINT => allow_mint
    };

    let constructor_access: URef =
    storage::create_contract_user_group(package_hash, CONSTRUCTOR_GROUP, 1, Default::default())
        .unwrap_or_revert()
        .pop()
        .unwrap_or_revert();

    let _: () = runtime::call_contract(contract_hash, ENTRY_POINT_CONSTRUCTOR, init_args);

    let mut urefs = BTreeSet::new();
    urefs.insert(constructor_access);
    storage::remove_contract_user_group_urefs(package_hash, CONSTRUCTOR_GROUP, urefs)
        .unwrap_or_revert();

    runtime::put_key(NAMED_KEY_MINTER_CONTRACT_HASH, contract_hash.into());
    // runtime::put_key(
    //     &format!("{contract_hash}_contract_hash_wrapped"),
    //     storage::new_uref(contract_hash).into(),
    // );
}


fn get_entry_points() -> EntryPoints {
    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_CONSTRUCTOR,
        vec![
            Parameter::new(ARG_ADMIN, CLType::Key),
            Parameter::new(ARG_FUND_MANAGER, CLType::Key),
            Parameter::new(ARG_CEP78_PACKAGE_HASH, CLType::Key),
            Parameter::new(ARG_MINT_FEE, CLType::U256),
            Parameter::new(ARG_ONLY_WHITELIST, CLType::Bool),
            Parameter::new(ARG_ALLOW_MINT, CLType::Bool),
        ],
        CLType::Unit,
        EntryPointAccess::Groups(vec![Group::new(CONSTRUCTOR_GROUP)]),
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_SET_CONFIG,
        vec![
            Parameter::new(ARG_ADMIN, CLType::Key),
            Parameter::new(ARG_FUND_MANAGER, CLType::Key),
            Parameter::new(ARG_MINT_FEE, CLType::U256),
            Parameter::new(ARG_ONLY_WHITELIST, CLType::Bool),
            Parameter::new(ARG_ALLOW_MINT, CLType::Bool),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_FREE_MINT,
        vec![
            Parameter::new(ARG_NFT_OWMER, CLType::Key),
            Parameter::new(ARG_COUNT, CLType::U64),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_NATIVE_MINT,
        vec![
            Parameter::new(ARG_NFT_OWMER, CLType::Key),
            Parameter::new(ARG_COUNT, CLType::U64),
            Parameter::new(ARG_SOURCE_PURSE, CLType::URef),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_CEP18_MINT,
        vec![
            Parameter::new(ARG_NFT_OWMER, CLType::Key),
            Parameter::new(ARG_COUNT, CLType::U64),
            Parameter::new(ARG_ALLOWER, CLType::Key),
            Parameter::new(ARG_CEP18_PACKAGE_HASH, CLType::Key),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_SET_WHITELIST,
        vec![
            Parameter::new(ARG_WHITELIST_ACCOUNTS, CLType::List(Box::new(CLType::Key))),
            Parameter::new(ARG_WHITELIST_VALUES, CLType::List(Box::new(CLType::Bool))),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_RESET_WHITELIST,
        vec![
            Parameter::new(ARG_WHITELIST_ACCOUNTS, CLType::List(Box::new(CLType::Key))),
            Parameter::new(ARG_WHITELIST_VALUES, CLType::List(Box::new(CLType::Bool))),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_GET_MINT_COST,
        vec![
            Parameter::new(ARG_COUNT, CLType::U64),
        ],
        CLType::U256,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points
}