pub mod media;
pub mod inout;
pub mod client;

use tauri::{command, Manager, Emitter};
use font_kit::source::SystemSource;
use std::collections::{HashSet, HashMap};
use reqwest::Client as HttpClient;
use tokio::sync::Mutex;
use std::sync::Arc;
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
use crate::client::*;

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
async fn fetch_url(url: String) -> Result<String, String> {
    let http_client = HttpClient::new();

    let response = match http_client.get(&url).send().await {
        Ok(res) => res,
        Err(err) => return Err(format!("Failed to fetch URL: {}", err)),
    };

    if !response.status().is_success() {
        return Err(format!("Failed to fetch URL: HTTP {}", response.status()));
    }

    match response.text().await {
        Ok(text) => Ok(text),
        Err(err) => Err(format!("Failed to get response text: {}", err)),
    }
}

#[command]
async fn get_login_options(
    state: tauri::State<'_, Mutex<MeshClient>>,
    homeserver_url: String
    ) -> Result<Vec<LoginOption>, String> {
    let homeserver_url = match Url::parse(&homeserver_url) {
        Ok(url) => url,
        Err(err) => return Err(format!("{err}")),
    };

    let client = match Client::new(homeserver_url).await {
        Ok(client) => client,
        Err(err) => return Err(format!("{err}")),
    };


    let mut options: Vec<LoginOption> = Vec::new();
    let login_types = match client.matrix_auth().get_login_types().await {
        Ok(logins) => logins.flows,
        Err(err) => return Err(format!("{err}")),
    };

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
    let mut client_lock = state.lock().await;

    client_lock.client = Some(Arc::new(client));

    Ok(options)
}

#[command]
async fn get_username(state: tauri::State<'_, Mutex<MeshClient>>) -> Result<Option<String>, String> {
    let client_lock = state.lock().await;
    Ok(client_lock.username.clone())
}

#[command]
async fn login(
    state: tauri::State<'_, Mutex<MeshClient>>, 
    kind: String, 
    username: String, 
    password: String
    ) -> Result<(), String> {

    let mut client_lock = state.lock().await;

    match kind {
        kind if kind == "Password".to_string() => {
            match client_lock
                .client
                .as_ref()
                .unwrap()
                .matrix_auth()
                .login_username(&username, &password)
                .initial_device_display_name("Mesh Client")
                .await
            {
                Ok(_) => println!("Successfully logged in!"),
                Err(err) => {
                    eprintln!("Login credentials are wrong!");
                    return Err(format!("{err}"))
                }
            }
            client_lock.client.as_ref().unwrap().add_event_handler(on_room_message);
            let rooms = client_lock.client.as_ref().unwrap().joined_rooms();
            let mut map: HashMap<String, Room> = HashMap::new();
            for room in rooms {
                map.insert(room.name().unwrap_or("".to_string()), room);
            }
            dbg!(map.clone());

            client_lock.rooms = Some(Arc::new(map));
            client_lock.username = Some(username);

            match client_lock.client.as_ref().unwrap().sync(SyncSettings::new()).await {
                Ok(_) => {}
                Err(err) => return Err(format!("{err}"))
            }
        }
        _ => return Err(format!("Unknown login kind {kind}"))
    }

   Ok(())
}

async fn on_room_message(event: OriginalSyncRoomMessageEvent, room: Room) {
    if room.state() != RoomState::Joined {
        return;
    }

    let MessageType::Text(msgtype) = &event.content.msgtype else {
        return;
    };

    dbg!(room.room_id());
    //app_handle.emit("room_messages", event).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(Mutex::new(
                MeshClient {
                    homeserver_url: None,
                    username: None,
                    client: None,
                    rooms: None
                }
                ))
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![get_system_fonts, get_login_options, fetch_url, get_username, login])
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
