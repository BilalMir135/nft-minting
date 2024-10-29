#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

pub mod constants;
mod error;
mod utils;

// We need to explicitly import the std alloc crate and `alloc::string::String` as we're in a
// `no_std` environment.
extern crate alloc;

use alloc::{collections::BTreeSet, format, string::String};

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{runtime_args, Key, URef, U256, ContractPackageHash, RuntimeArgs};

use constants::get_entry_points;
use utils::{set_key, caller_is_admin};
use error::Error;

const CONSTRUCTOR_GROUP: &str = "constructor";

#[no_mangle]
pub extern "C" fn init() {
    let admin = runtime::get_named_arg::<Key>(constants::ARG_ADMIN);
    let fund_manager = runtime::get_named_arg::<Key>(constants::ARG_FUND_MANAGER);
    let cep78_contract_hash = runtime::get_named_arg::<Key>(constants::ARG_CEP78_CONTRACT_PACKAGE_HASH);
    let mint_price = runtime::get_named_arg::<U256>(constants::ARG_MINT_PRICE);

    set_key(constants::NAMED_KEY_ADMIN, admin);
    set_key(constants::NAMED_KEY_FUND_MANAGER, fund_manager);
    set_key(constants::NAMED_KEY_CEP78_CONTRACT_PACKAGE_HASH, cep78_contract_hash);
    set_key(constants::NAMED_KEY_MINT_PRICE, mint_price);
}

#[no_mangle]
pub extern "C" fn update_admin() {
   if !caller_is_admin() {
    runtime::revert(Error::PermissionDenied);
   }

   let admin = runtime::get_named_arg::<Key>(constants::ARG_ADMIN);
   set_key(constants::NAMED_KEY_ADMIN, admin);
}

#[no_mangle]
pub extern "C" fn update_fund_manager() {
   if !caller_is_admin() {
    runtime::revert(Error::PermissionDenied);
   }

   let fund_manager = runtime::get_named_arg::<Key>(constants::ARG_FUND_MANAGER);
   set_key(constants::NAMED_KEY_FUND_MANAGER,fund_manager);
}


#[no_mangle]
pub extern "C" fn mint() {
   runtime::revert(Error::InvalidContext);
}

#[no_mangle]
pub extern "C" fn call() {
    let admin = runtime::get_named_arg::<Key>(constants::ARG_ADMIN);
    let fund_manager = runtime::get_named_arg::<Key>(constants::ARG_FUND_MANAGER);
    let cep78_contract_hash = runtime::get_named_arg::<Key>(constants::ARG_CEP78_CONTRACT_PACKAGE_HASH);
    let mint_price = runtime::get_named_arg::<U256>(constants::ARG_MINT_PRICE);

    let (contract_hash, _) = storage::new_contract(
        get_entry_points(),
        None,
        Some(String::from(constants::NAMED_KEY_MINTER_CONTRACT_PACKAGE_HASH)),
        None,
    );

    let package_hash: ContractPackageHash = ContractPackageHash::new(
        runtime::get_key(constants::NAMED_KEY_MINTER_CONTRACT_PACKAGE_HASH)
            .unwrap_or_revert()
            .into_hash()
            .unwrap_or_revert(),
    );

    let package_hash_key: Key = package_hash.into();

    let init_args = runtime_args! {
        constants::ARG_ADMIN => admin,
        constants::ARG_FUND_MANAGER => fund_manager,
        constants::ARG_CEP78_CONTRACT_PACKAGE_HASH => cep78_contract_hash,
        constants::ARG_MINT_PRICE => mint_price,
    };

    let constructor_access: URef =
    storage::create_contract_user_group(package_hash, CONSTRUCTOR_GROUP, 1, Default::default())
        .unwrap_or_revert()
        .pop()
        .unwrap_or_revert();

    let _: () = runtime::call_contract(contract_hash, constants::ENTRY_POINT_INIT, init_args);

    let mut urefs = BTreeSet::new();
    urefs.insert(constructor_access);
    storage::remove_contract_user_group_urefs(package_hash, CONSTRUCTOR_GROUP, urefs)
        .unwrap_or_revert();

    runtime::put_key(constants::NAMED_KEY_MINTER_CONTRACT_HASH, contract_hash.into());
    runtime::put_key(
        &format!("{contract_hash}_contract_hash_wrapped"),
        storage::new_uref(contract_hash).into(),
    );
}
