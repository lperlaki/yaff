use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Store {
    pub number: u32
}

#[wasm_bindgen]
impl Store {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Store {number: 2}
    }
}

#[wasm_bindgen]
pub fn greet() -> String {
    String::from("Hello World")
}
