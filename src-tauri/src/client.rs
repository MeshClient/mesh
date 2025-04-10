use std::sync::Arc;
use std::collections::HashMap;
use matrix_sdk::{
    ruma::RoomId,
    Client, Room
};

pub struct MeshClient {
    pub homeserver_url: Option<String>,
    pub username: Option<String>,
    pub client: Option<Arc<Client>>,
    pub rooms: Option<Arc<HashMap<String, Room>>>
}


