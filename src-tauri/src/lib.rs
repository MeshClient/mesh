use tauri::command;
use font_kit::source::SystemSource;
use std::collections::HashSet;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![get_system_fonts])
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
