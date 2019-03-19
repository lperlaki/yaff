# Store

A Proxy based state Manager.

```sh
yarn add @yaff/store
npm i @yaff/store
```

## Simple Usage

```js
import { Store } from '@yaff/store';

// Initialise the Store

const store = new Store({
    state: {
        count: 0,
    },
});

// set State

store.count = 1;

// get State

console.assert(store.count == 1);
```

## Watch for changes

Register listners to Watch for changes on Sate values

```js
const store = new Store({
    state: {
        count: 0,
    },
});

store.watch('count' newVal => {console.log(newVal)})

// store.count.watch(cb) == store.watch('count', cb)

store.count++
```

## Cutom getters

> WIP curently watch doesn't work on getters

```js
const store = new Store({
    state: {
        truth: true,
    },
    getters: {
        inverse: store => !store.truth,
    },
});

console.assert(store.inverse != store.truth);
```

## Actions

> In store defined functions

```js
const store = new Store({
    state: {
        count: 0,
    },
    actions: {
        increment() {
            this.count++;
        },
    },
});

store.increment();
// store.increment(args) == store.dispatch('increment', args)

console.assert(store.count == 1);
```

## Arrays

Currently only inmutable arrays are suported

```js
const store = new Store({
    state: {
        items: [],
    },
    actions: {
        remove(index) {
            // [...] Currently needed to create a copy
            this.items = [...this.items.filter((_, i) => i != index)];
        },
    },
});

// add 3 elements to items
store.items = [...store.items, 1, 3, 5];

// use actions to simplify code
store.remove(0);

console.assert(store.items == [3, 5]);
```
