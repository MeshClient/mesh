pub fn mxc_to_https(
    mxc_url: String,
    direct_link: bool,
    thumbnail_width: usize,
    thumbnail_height: usize,
    resize_method: String,
    use_authentication: bool,
) -> String {
    if !mxc_url.starts_with("mxc://") {
        if direct_link {
            return mxc_url;
        } else {
            return "".to_string();
        }
    }

    let parts: Vec<&str> = mxc_url[6..].split('/').collect();

    if parts.len() != 2 {
        return "".to_string();
    }

    let server = parts[0];
    let media_id = parts[1];

    let thumbnail_request = thumbnail_width > 0 || thumbnail_height > 0 || !resize_method.is_empty();

    let verb = if thumbnail_request {
        "thumbnail"
    } else {
        "download"
    };

    let prefix = if use_authentication {
        format!("/_matrix/client/v1/media/{}", verb)
    } else {
        format!("/_matrix/media/v1/{}", verb)
    };

    let mut url = format!("https://{}{}/{}/{}", server, prefix, server, media_id);

    if thumbnail_request {
        let method = if resize_method.is_empty() {
            "crop"
        } else {
            &resize_method
        };
        url = format!(
            "{}?width={}&height={}&method={}",
            url, thumbnail_width, thumbnail_height, method
        );
    }

    url
}
