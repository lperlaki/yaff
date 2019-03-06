const Store = require('./store');

const store = new Store({
    state: {
        count: 1,
    },
    watch: {
        count(val) {
            console.log(val);
        },
    },
    actions: {
        add(store, args) {
            console.log(store, args);
        },
    },
});

console.log(store.count);

ref = store.count.store;

console.log(ref.count);

store.count++;

console.log(store.count);
console.log(ref.count);

ref.count++;

console.log(store.count);
console.log(ref.count);
