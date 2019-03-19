# State Component

A custom component which can be linked to a [Store](https://npmjs.com/@yaff/store) state

```html
<state-wrapper id="mystate"></state-wrapper>
```

```js
// Store from @yaff/store
const store = new Store({
    state: {
        count: 0,
    },
});

const mystate = document.querySelector('#mystate');

// set the value of mystate
mystate.state = store.count;

// this will update the value in mystate
store.count++;
```

## h literal template

```js
//helper function for easy element creation4

const el = h`<div><button> Click me</button> Clicked ${
    store.count
} times </div>`;

document.body.append(el);
```

## Nested functions

```js
const store = new Store({
    state: {
        items: [],
    },
    actions: {
        add(item) {
            this.items = [...this.items, item];
        },
    },
});

store.add('Hello');
store.add('World');

// curently doesnot update automaticaly
const el = h`<div><ul>${store.items.map(
    (val, i) => h`<li key="${i}">${val}</li>`
)}</ul></div>`;

document.body.append(el);
```
