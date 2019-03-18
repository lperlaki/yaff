# Store

A Proxy based state Manager.

## Simple Usage

```js
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
