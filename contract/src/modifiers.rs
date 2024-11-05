use casper_types::Key;

use crate::data;
use crate::error::Error;

pub fn only_admin(caller:Key) -> Result<(), Error>{
    if caller != data::get_admin() {
        Err(Error::PermissionDenied)
    } else {
        Ok(())
    }
}