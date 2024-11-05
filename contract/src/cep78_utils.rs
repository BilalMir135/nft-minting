use alloc::{format, string::String};
use casper_contract::{contract_api::runtime,  unwrap_or_revert::UnwrapOrRevert};
use casper_types::{ContractPackageHash, Key, RuntimeArgs, runtime_args};

use crate::data;
use crate::error::Error;

fn get_cep78_package_hash() -> ContractPackageHash {
    data::get_cep78_package_hash()
        .into_hash()
        .map(ContractPackageHash::new)
        .unwrap_or_revert_with(Error::InvalidContractPackageHash)
}

fn generate_metadata(count: u64) -> String {
    format!(r#"{{ 
        "name": "John Doe", 
        "symbol": "abc", 
        "token_uri": "https://www.barfoo.com/{}" 
    }}"#, count)
}

pub fn register_owner(owner:Key) {
    let cep78_package_hash = get_cep78_package_hash();

    let args = runtime_args! {
        "token_owner" => owner,
    };

    runtime::call_versioned_contract(
        cep78_package_hash, 
        None, 
        "register_owner", 
        args
    )
}

pub fn mint(owner:Key) {
    let cep78_package_hash = get_cep78_package_hash();

    let args = runtime_args! {
        "token_owner" => owner,
        "token_meta_data" => generate_metadata(1)
    };

    runtime::call_versioned_contract(
        cep78_package_hash, 
        None, 
        "mint", 
        args
    )
}