import {
    h,
    Store
} from './lib';

const store = new Store({
    state: {
        count: 0,
    },
});

window.store = store

document.body.appendChild(h `<div>Hello World ${store.count}</div>`);


document.all.clicks.state = store.count


document.all['btn-clicks'].addEventListener('click', () => store.count++);