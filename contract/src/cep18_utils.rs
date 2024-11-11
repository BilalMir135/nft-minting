use casper_contract::{contract_api::runtime, unwrap_or_revert::UnwrapOrRevert};
use casper_types::{ContractPackageHash, Key, U256, RuntimeArgs, runtime_args};

use crate::data;
use crate::error::Error;

fn get_package_hash(cep18_package_hash: Key) -> ContractPackageHash {
    cep18_package_hash.into_hash()
        .map(ContractPackageHash::new)
        .unwrap_or_revert_with(Error::InvalidContractPackageHash)
}

pub fn balance_of(address: Key, cep18_package_hash: Key) -> U256 {
    let package_hash = get_package_hash(cep18_package_hash);

    let balance = runtime::call_versioned_contract::<U256>(
        package_hash,
        None,
        "balance_of",
        runtime_args! {
            "address" => address,
        }
    );

    balance
}

pub fn transfer_from(owner: Key, amount: U256, cep18_package_hash: Key) {
    let package_hash = get_package_hash(cep18_package_hash);
    let fund_manager = data::get_fund_manager();

    runtime::call_versioned_contract(
        package_hash,
        None,
        "transfer_from",
        runtime_args! {
            "owner" => owner,
            "recipient" => fund_manager,
            "amount" => amount
        }
    )
}