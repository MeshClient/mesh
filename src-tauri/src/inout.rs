use crate::media::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize)]
pub struct LoginOption {
    login_type: String,
    provider: Option<String>,
    icon_url: Option<String>
}

impl LoginOption {
    pub fn from_sso(provider: String, icon_mxc: String) -> Self {
        Self {
            login_type: "SSO".to_string(),
            provider: Some(provider),
            icon_url: Some(mxc_to_https(icon_mxc, false, 0, 0, "".to_string(), false))
        }
    }

    pub fn from_other(login_type: String) -> Self {
        Self {
            login_type,
            provider: None,
            icon_url: None
        }
    }
}

#[derive(Serialize)]
pub struct RoomMessage {

}
