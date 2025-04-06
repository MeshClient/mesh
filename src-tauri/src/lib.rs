pub mod media;
pub mod inout;

use tauri::command;
use font_kit::source::SystemSource;
use std::collections::HashSet;

use matrix_sdk::{
    config::SyncSettings,
    ruma::{
        api::client::session::get_login_types::v3::{IdentityProvider, LoginType},
        events::room::message::{MessageType, OriginalSyncRoomMessageEvent}
    },
    Client, Room, RoomState
};
use url::Url;

use crate::media::*;
use crate::inout::*;

#[command]
fn get_system_fonts() -> Result<Vec<String>, String> {
    let source = SystemSource::new();
    let family_names = match source.all_families() {
        Ok(names) => names,
        Err(err) => return Err(format!("Failed to get font families: {}", err)),
    };
    let mut unique_fonts = HashSet::new();
    for name in family_names {
        unique_fonts.insert(name);
    }
    let mut sorted_fonts: Vec<String> = unique_fonts.into_iter().collect();
    sorted_fonts.sort();

    Ok(sorted_fonts)
}

#[command]
async fn get_login_options(homeserver_url: String) -> Result<Vec<LoginOption>, String> {
    let homeserver_url = url::Url::parse(&homeserver_url);
    match homeserver_url {
        Ok(_) => {},
        Err(err) => return Err(format!("{err}")),
    };

    let client = Client::new(homeserver_url.unwrap()).await;
    match client {
        Ok(_) => {},
        Err(err) => return Err(format!("{err}")),
    };


    let mut options: Vec<LoginOption> = Vec::new();
    let logins = client.unwrap().matrix_auth().get_login_types().await;
    match logins {
        Ok(_) => {},
        Err(err) => return Err(format!("{err}")),
    };

    let login_types = logins.unwrap().flows;

    for login_type in login_types {
        match login_type {
            LoginType::Password(_) => options.push(LoginOption::from_other("Password".to_string())),
            LoginType::Sso(sso) => {
                if sso.identity_providers.is_empty() {
                    continue;
                }
                else {
                    options.extend(sso.identity_providers.into_iter().map(|idp| LoginOption::from_sso(idp.name,idp.icon.unwrap().to_string())));
                }
            }
            _ => {}
        }
    }

    Ok(options)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![get_system_fonts, get_login_options])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
