use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu};

pub fn app_menu() -> Menu {
    // let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    // let close = CustomMenuItem::new("close".to_string(), "Close");
    // let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
    // let menu = Menu::new()
    //     .add_native_item(MenuItem::Quit)
    //     .add_item(CustomMenuItem::new("hide", "Hide"))
    //     .add_submenu(submenu);

    let metadata = AboutMetadata::new();

    let metadata = metadata.version("0.1.0".to_owned());
    let metadata = metadata.authors(vec!["Kube Knots".to_owned()]);
    let metadata = metadata.website("https://kube-knots.com".to_owned());

    let menu = Menu::os_default("Kube Knots")
        .add_native_item(MenuItem::About("Kube Knot".to_owned(), metadata));

    return menu;
}
