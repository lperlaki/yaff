const {
    Store,
    greet
} = require('./pkg/rust_store')

console.log(greet())


const a = new Store()

console.log(a.number)