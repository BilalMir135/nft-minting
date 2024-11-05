#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

extern crate alloc;
use alloc::{vec, collections::BTreeSet, format, string::{String, ToString}};

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{runtime_args, Key, URef, U256, ContractPackageHash, RuntimeArgs, EntryPoint, EntryPoints, EntryPointType, EntryPointAccess, Parameter, Group, CLTyped};
use contract_utils::{ContractContext, OnChainContractStorage};

use contract::minter::MINTER;

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
    ) {
        MINTER::init(
            self,
            admin,
            fund_manager,
            cep78_package_hash,
            mint_fee,
        )
    }
}

const CONSTRUCTOR_GROUP: &str = "constructor";

const ARG_ADMIN: &str = "admin";
const ARG_FUND_MANAGER: &str = "fund_manager";
const ARG_CEP78_PACKAGE_HASH: &str = "cep78_package_hash";
const ARG_MINT_FEE: &str = "mint_fee";
const ARG_NFT_OWMER: &str = "nft_owner";

const ENTRY_POINT_CONSTRUCTOR: &str = "constructor";
const ENTRY_POINT_UPDATE_ADMIN: &str = "update_admin";
const ENTRY_POINT_FREE_MINT: &str = "free_mint";

const NAMED_KEY_MINTER_CONTRACT_HASH: &str = "minter_contract_hash";
const NAMED_KEY_MINTER_CONTRACT_PACKAGE_HASH: &str = "minter_contract_package_hash";

#[no_mangle]
pub extern "C" fn constructor() {
    let admin = runtime::get_named_arg::<Key>(ARG_ADMIN);
    let fund_manager = runtime::get_named_arg::<Key>(ARG_FUND_MANAGER);
    let cep78_package_hash = runtime::get_named_arg::<Key>(ARG_CEP78_PACKAGE_HASH);
    let mint_fee = runtime::get_named_arg::<U256>(ARG_MINT_FEE);

    Minter::default().constructor(admin, fund_manager, cep78_package_hash, mint_fee);
}

#[no_mangle]
pub extern "C" fn update_admin() {
    let admin = runtime::get_named_arg::<Key>(ARG_ADMIN);
    Minter::default().update_admin(admin).unwrap_or_revert();
}

#[no_mangle]
pub extern "C" fn free_mint() {
    let nft_owner = runtime::get_named_arg::<Key>(ARG_NFT_OWMER);
    Minter::default().free_mint(nft_owner).unwrap_or_revert();
}

#[no_mangle]
pub extern "C" fn call() {
    let admin = runtime::get_named_arg::<Key>(ARG_ADMIN);
    let fund_manager = runtime::get_named_arg::<Key>(ARG_FUND_MANAGER);
    let cep78_package_hash = runtime::get_named_arg::<Key>(ARG_CEP78_PACKAGE_HASH);
    let mint_fee = runtime::get_named_arg::<U256>(ARG_MINT_FEE);

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
            Parameter::new(ARG_ADMIN, String::cl_type()),
            Parameter::new(ARG_FUND_MANAGER, String::cl_type()),
            Parameter::new(ARG_CEP78_PACKAGE_HASH, String::cl_type()),
            Parameter::new(ARG_MINT_FEE, U256::cl_type()),
        ],
        <()>::cl_type(),
        EntryPointAccess::Groups(vec![Group::new(CONSTRUCTOR_GROUP)]),
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_UPDATE_ADMIN,
        vec![Parameter::new(ARG_ADMIN, String::cl_type()),],
        String::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_FREE_MINT,
        vec![Parameter::new(ARG_NFT_OWMER, String::cl_type()),],
        String::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points
}