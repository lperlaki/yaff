export {
    default as Store
}
from './store';


export class WrapperElement extends HTMLElement {
    connectedCallback() {
        this.watch()
    }
    disconnectedCallback() {
        if (this.watcher) this.watcher();
    }
    set state(state) {
        if (state.hasOwnProperty('store')) {
            this.stateref = state;
            this.watch()
        } else this.update(state)
    }
    get state() {
        return this.stateref
    }
    get value() {
        return this.ref;
    }
    update(val) {
        this.ref = val
        this.innerHTML = this.value;
    }
    watch() {
        if (this.state)
            this.watcher = this.state.watch(val => this.update(val));
    }
    constructor(val = '') {
        super();
        this.state = val
    }
}

// function h(s, ...vars) {
//     let temp = s[0];
//     for (let i = 0; i < vars.length; i++) {
//         const key = vars[i].key;
//         const uid = Math.floor(Math.random() * (1 << 24));
//         temp += `<span store-${key}-${uid}>${vars[i]}</slot>${s[i + 1]}`;
//         vars[i].watch(val => {
//             const sel = `[store-${key}-${uid}]`;
//             const el = document.querySelector(sel);
//             if (el) el.innerHTML = val;
//         });
//     }
//     const template = document.createElement('template');
//     template.innerHTML = temp;
//     return template.content;
// }


export class Component extends HTMLElement {
    constructor(content) {
        super();
        const shadowRoot = this.attachShadow({
            mode: 'open'
        })
        shadowRoot.appendChild(content.cloneNode(true))
    }
}


export function h(s, ...v) {
    const temp = document.createElement('template');
    temp.innerHTML = s.join('<store-wrapper>');
    const content = document.importNode(temp.content, true);
    content.querySelectorAll('store-wrapper').forEach((el, i) => {
        el.state = v[i]
    })
    return content
}