use std::sync::Arc;
use matrix_sdk::{
    Client, Room
};

pub struct MeshClient {
    pub homeserver_url: Option<String>,
    pub username: Option<String>,
    pub client: Option<Arc<Client>>,
}


